import React from 'react'
import Paymentpage from '../../componets/Paymentpage';


const Username = async({ params }) => {
  const { username } = await params; 
  


return (
  <>  
<Paymentpage username={username}/>
 </>
)
}

export default Username

export const metadata = {
  title: "Support Creator | FundRazer",
  description: "Send support and donations to your favorite creators on FundRazer.",
}