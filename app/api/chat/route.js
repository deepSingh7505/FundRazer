import { streamText } from 'ai';
import { groq } from '@ai-sdk/groq';
import connectDB from '@/lib/mongodb';
import User from '../../../models/User';
import Payment from '../../../models/payment';

function getErrorMessage(error) {
  if (!error) return 'Unknown error';
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.message;
  return JSON.stringify(error);
}

export async function POST(req) {
  try {
    const { message } = await req.json();

    await connectDB();

    const user = await User.findOne()
      .select('-_id -razorpayid -razorpaysecret -email -__v')
      .lean();

    const payments = await Payment.find()
      .select('-_id -oid -done -__v')
      .lean();

    const systemPrompt = `
You are a helpful assistant for a creator funding platform.

Use the raw data below to answer questions like:
- who donated the most
- who donated the least
- oldest payment
- newest payment
- total donations
- supporter names and messages

Never reveal hidden or confidential data.
Only answer from the provided data.

SAFE USER DATA:
${JSON.stringify(user, null, 2)}

SAFE PAYMENT DATA:
${JSON.stringify(payments, null, 2)}
`;

    const result = streamText({
      model: groq('llama-3.3-70b-versatile'),
      system: systemPrompt,
      prompt: message?.parts?.find(part => part.type === 'text')?.text || '',
    });

    return result.toUIMessageStreamResponse({
      getErrorMessage,
    });
  } catch (error) {
    console.error('CHAT API ERROR:', error);
    return Response.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}