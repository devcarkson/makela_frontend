// import { useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { toast } from 'sonner';
// import { verifyPayment } from '@/api/payment';

// const PaymentVerification = () => {
//   const { tx_ref } = useParams();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const verify = async () => {
//       try {
//         const result = await verifyPayment(tx_ref!);
        
//         if (result.status === 'success') {
//           toast.success('Payment successful!');
//           navigate(`/orders/${result.order_id}`);
//         } else {
//           toast.error('Payment verification failed');
//           navigate('/checkout');
//         }
//       } catch (error) {
//         toast.error('Error verifying payment');
//         navigate('/checkout');
//       }
//     };

//     verify();
//   }, [tx_ref, navigate]);

//   return (
//     <div className="flex items-center justify-center h-screen">
//       <div className="text-center">
//         <h1 className="text-2xl font-bold mb-4">Verifying your payment...</h1>
//         <p>Please wait while we confirm your transaction.</p>
//       </div>
//     </div>
//   );
// };

// export default PaymentVerification;