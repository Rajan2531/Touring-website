import axios from 'axios'
const stripe=Stripe("pk_test_51LlW3PSDmCCfV1vFO9PfmtfqGBsnnNECyoAPcdfdskiTxhcX8v7BKbwsQ7OcedfeW5WavvL7rZveflIT2bIZNB0Y00Hn6Tazbe")

export const bookTour=async(tourId)=>{
    try{
    const res=await axios(`http://127.0.0.1:3000/api/v1/bookings/create-stripe-session/${tourId}`);
    //console.log(res.data.url);
    await stripe.redirectToCheckout({
        sessionId:res.data.id
    });
    }
    catch(err)
    {
        //console.log(err);
    }

}