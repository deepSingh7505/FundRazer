import { streamText } from 'ai';
import { groq } from '@ai-sdk/groq';
import connectDB from '@/lib/mongodb';
import User from "../../../models/User"
import Payment from '../../../models/payment';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

function getErrorMessage(error) {
  if (!error) return 'Unknown error';
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.message;
  return JSON.stringify(error);
}

// Extract user-provided name from message history
function extractUserProvidedName(messages) {
  if (!Array.isArray(messages) || messages.length === 0) return null;

  const lastUserMessage = [...messages]
    .reverse()
    .find(msg => msg.role === 'user');

  if (!lastUserMessage) return null;

  const text = lastUserMessage.content || 
               lastUserMessage.parts?.[0]?.text || '';

  const namePatterns = [
    /(?:I am|I'm|my name is|I'm called|call me)\s+([A-Za-z\s]+)(?:\.|,|$)/i,
    /^([A-Za-z\s]+)$/i,
  ];

  for (const pattern of namePatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }

  return null;
}

// ✅ CLEAN SYSTEM PROMPT BUILDER - No backtick issues
function buildSystemPrompt(isAuthenticated, userContext, paymentContext, messages) {
  const extractedName = extractUserProvidedName(messages);

  let authSection = '';

  if (isAuthenticated) {
    authSection = 'USER IS LOGGED IN (Authenticated Creator)\n' +
      'You have full access to this user\'s personal data and statistics.\n' +
      userContext + '\n' +
      paymentContext + '\n\n' +
      'You can help them:\n' +
      '- Understand their supporter base and donations\n' +
      '- Update their profile (name, username, profile picture, cover picture)\n' +
      '- Configure payment settings (Razorpay details)\n' +
      '- Share their page to attract more supporters\n' +
      '- Analyze donation patterns and supporter messages';
  } else if (extractedName) {
    authSection = 'USER IS NOT LOGGED IN (Visitor/Guest)\n' +
      'User mentioned: "' + extractedName + '"\n' +
      userContext + '\n' +
      paymentContext + '\n\n' +
      'You can:\n' +
      '- Show public information about creators they\'re asking about\n' +
      '- NOT reveal private payment details or personal info\n' +
      '- Guide them to the creator\'s public page to send support\n' +
      '- Explain how FundRazer works';
  } else {
    authSection = 'USER IS NOT LOGGED IN (Visitor/Guest)\n' +
      'You do NOT have access to any user data.\n\n' +
      'You can:\n' +
      '- Explain what FundRazer is and how it works\n' +
      '- Describe all pages and features\n' +
      '- Guide users on how to discover creators\n' +
      '- Help them understand how to send support\n' +
      '- Suggest they log in to access creator features\n' +
      '- Do NOT reveal specific user data or donation details';
  }

  const systemPrompt = 
    'You are FundRazer\'s AI Assistant - a friendly, helpful guide for creators and supporters.\n\n' +
    'CORE IDENTITY:\n' +
    '- You\'re a warm, knowledgeable website guide (not a robot or AI)\n' +
    '- You speak like a real person who knows the platform well\n' +
    '- You help users understand FundRazer and navigate it easily\n\n' +
    '---\n\n' +
    'AUTHENTICATION STATUS:\n' +
    authSection + '\n\n' +
    '---\n\n' +
    'CORE RULES (FOLLOW THESE ALWAYS):\n\n' +
    '1. Only use provided data\n' +
    '   - Answer ONLY from data I give you\n' +
    '   - If you don\'t have information, say "I don\'t have that info"\n' +
    '   - NEVER make up donation amounts, names, or statistics\n\n' +
    '2. Protect privacy\n' +
    '   - Never reveal database structure, MongoDB, APIs, or technical details\n' +
    '   - Don\'t mention hidden fields or technical implementation\n' +
    '   - Keep data confidential - only share what\'s appropriate\n\n' +
    '3. Sound natural\n' +
    '   - Use simple, everyday language\n' +
    '   - Keep responses concise (2-3 sentences max)\n' +
    '   - Use contractions (you\'re, don\'t, it\'s) for friendliness\n' +
    '   - Avoid robotic or documentation tone\n\n' +
    '4. Guide, don\'t confuse\n' +
    '   - When users ask "where do I do X?", give direct instructions\n' +
    '   - Example: "You can update your profile from the Dashboard. Click the menu in the top right and select Edit Profile."\n' +
    '   - Don\'t explain routes, APIs, or backend logic\n\n' +
    '5. Be honest about limitations\n' +
    '   - If unsure, say so: "I\'m not sure about that one, but you can find more info on the About page"\n' +
    '   - Don\'t guess or make assumptions\n\n' +
    '---\n\n' +
    'PLATFORM OVERVIEW:\n\n' +
    'What is FundRazer?\n' +
    'FundRazer is a creator support and crowdfunding platform. Supporters discover creators, visit their pages, and send direct support. Creators manage their profile, payment details, and see who\'s supporting them.\n\n' +
    'Main Pages:\n' +
    '1. Home - Introduces FundRazer and highlights key benefits\n' +
    '2. About - Explains the platform\'s purpose and how it works\n' +
    '3. Dashboard / Edit Profile - Where creators manage their profile, images, and Razorpay payment details (requires login)\n' +
    '4. Your Page - The creator\'s public profile where supporters can view them and send support\n' +
    '5. Search Bar (Navbar) - Find creators by username\n' +
    '6. Support Button - Send money to creators directly and securely\n\n' +
    '---\n\n' +
    'RESPONSE EXAMPLES:\n\n' +
    'Visitor asks: "What is FundRazer?"\n' +
    'Answer: "FundRazer is a platform where you can discover and support creators directly. Browse creator profiles, see who\'s supporting them, and send them support yourself."\n\n' +
    'Creator (logged in) asks: "How do I update my profile picture?"\n' +
    'Answer: "Go to your Dashboard and click \'Edit Profile\' from the top-right menu. You\'ll see options to change your profile picture, cover image, and other details."\n\n' +
    'Creator asks: "Who are my top supporters?"\n' +
    'Answer: Use the data provided above to answer specifically with real names and amounts\n\n' +
    'Visitor asks: "How do I send support?"\n' +
    'Answer: "Find a creator using the search bar in the top right, visit their page, and look for the support button."\n\n' +
    '---\n\n' +
    'Remember: You\'re a helpful friend who knows FundRazer inside and out. Be warm, stay helpful, and respect user privacy!';

  return systemPrompt;
}

export async function POST(req) {
  try {
    const { messages } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return Response.json(
        { error: 'Messages must be an array' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if user is logged in via NextAuth
    const session = await getServerSession(authOptions);

    let userContext = '';
    let paymentContext = '';
    let isAuthenticated = false;

    if (session?.user?.email) {
      // USER IS LOGGED IN
      isAuthenticated = true;

      try {
        const dbUser = await User.findOne({ email: session.user.email }).lean();

        if (dbUser) {
          userContext = 
            'LOGGED-IN CREATOR (Authenticated via NextAuth):\n' +
            '- Name: ' + (dbUser.name || 'Not set') + '\n' +
            '- Username: ' + dbUser.username + '\n' +
            '- Email: ' + session.user.email + '\n' +
            '- Profile Picture: ' + (dbUser.profilepicture ? 'Set' : 'Not set') + '\n' +
            '- Cover Picture: ' + (dbUser.coverpicture ? 'Set' : 'Not set') + '\n' +
            '- Razorpay Status: ' + (dbUser.razorpayid ? 'Connected' : 'Not connected');

          // Get only this user's payments
          const payments = await Payment.find({
            to_user: dbUser.username,
            done: true,
          })
            .sort({ _id: -1 })
            .select('-oid -__v')
            .lean();

          if (payments.length > 0) {
            const totalDonations = payments.reduce(
              (sum, p) => sum + (p.amount || 0),
              0
            );
            const sortedByAmount = [...payments].sort(
              (a, b) => (b.amount || 0) - (a.amount || 0)
            );

            const recentList = payments
              .slice(0, 5)
              .map((p, i) => {
                return (i + 1) + '. ' + (p.name || 'Anonymous') + ' - ' + p.amount + ' rupees (Message: ' + (p.message || 'no message') + ')';
              })
              .join('\n');

            paymentContext =
              'YOUR DONATION STATISTICS:\n' +
              '- Total donations received: ' + totalDonations + ' rupees\n' +
              '- Number of supporters: ' + payments.length + '\n' +
              '- Top supporter: ' + (sortedByAmount[0]?.name || 'Anonymous') + ' donated ' + (sortedByAmount[0]?.amount || 0) + ' rupees\n' +
              '- Latest donation: ' + (payments[0]?.name || 'Anonymous') + ' sent ' + (payments[0]?.amount || 0) + ' rupees\n' +
              '- Donation range: ' + Math.min(...payments.map(p => p.amount || 0)) + ' to ' + Math.max(...payments.map(p => p.amount || 0)) + ' rupees\n\n' +
              'Recent supporters (last 5):\n' +
              recentList;
          } else {
            paymentContext =
              'YOUR DONATION STATISTICS:\n' +
              '- You haven\'t received any donations yet\n' +
              '- Share your unique page link with your audience to start getting support!\n' +
              '- Your supporters can find you by searching your username: ' + dbUser.username;
          }
        }
      } catch (error) {
        console.error('Error loading authenticated user data:', error);
        paymentContext = 'Note: Unable to load donation data at this moment. Please try again later.';
      }
    } else {
      // USER NOT LOGGED IN - Try to detect from chat
      const userProvidedName = extractUserProvidedName(messages);

      if (userProvidedName) {
        try {
          const dbUser = await User.findOne({
            $or: [
              { username: userProvidedName.toLowerCase() },
              { name: userProvidedName },
            ],
          }).lean();

          if (dbUser) {
            userContext =
              'VISITOR INQUIRY (Not logged in, looking up: ' + userProvidedName + '):\n' +
              '- Found creator: ' + (dbUser.name || dbUser.username) + '\n' +
              '- Username: ' + dbUser.username;

            const paymentCount = await Payment.countDocuments({
              to_user: dbUser.username,
              done: true,
            });

            if (paymentCount > 0) {
              const recentPayments = await Payment.find({
                to_user: dbUser.username,
                done: true,
              })
                .sort({ _id: -1 })
                .limit(3)
                .select('name amount message')
                .lean();

              const totalAmount = await Payment.aggregate([
                {
                  $match: { to_user: dbUser.username, done: true },
                },
                { $group: { _id: null, total: { $sum: '$amount' } } },
              ]);

              const total = totalAmount[0]?.total || 0;

              const recentList = recentPayments
                .slice(0, 3)
                .map((p, i) => {
                  return '  ' + (i + 1) + '. ' + (p.name || 'Anonymous') + ' - ' + p.amount + ' rupees';
                })
                .join('\n');

              paymentContext =
                'CREATOR STATS (' + userProvidedName + '):\n' +
                '- Total donations received: ' + total + ' rupees\n' +
                '- Number of supporters: ' + paymentCount + '\n' +
                '- Recent support activity:\n' +
                recentList;
            } else {
              paymentContext =
                'CREATOR STATS (' + userProvidedName + '):\n' +
                '- No donations yet\n' +
                '- This creator is just getting started!';
            }
          }
        } catch (error) {
          console.error('Error looking up creator:', error);
        }
      }
    }

    // ✅ Build system prompt (no backtick issues)
    const systemPrompt = buildSystemPrompt(isAuthenticated, userContext, paymentContext, messages);

    const formattedMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.parts?.[0]?.text || msg.content || '',
    }));

    const result = streamText({
      model: groq('llama-3.3-70b-versatile'),
      system: systemPrompt,
      messages: formattedMessages,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('CHAT API ERROR:', error);
    return Response.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}