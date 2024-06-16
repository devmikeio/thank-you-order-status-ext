import {
  useApi,
  reactExtension,
  Text,
  useCartLineTarget,
  BlockStack,
  Button,
  Heading,
  View,
  Choice,
  ChoiceList,
} from '@shopify/ui-extensions-react/checkout';
import { useEffect, useState } from 'react';

const thankYouBlock = reactExtension(
  'purchase.thank-you.cart-line-item.render-after',
  () => <Extension />,
);
export {thankYouBlock}

const orderStatusBlock = reactExtension(
  'customer-account.order-status.cart-line-item.render-after',
  () => <Extension />,
);
export {orderStatusBlock}

const checkoutBlock = reactExtension(
  'purchase.checkout.cart-line-item.render-after',
  () => <Extension />,
);
export {checkoutBlock}

// const thankYouSurveyBlock = reactExtension(
//   'purchase.thank-you.block.render',
//   () => <Attribution />,
// );
// export {thankYouSurveyBlock}

// const orderDetailsSurveyBlock = reactExtension(
//   'customer-account.order-status.block.render',
//   () => <ProductReview />,
// );
// export {orderDetailsSurveyBlock}

// function Attribution() {
//   const [attribution, setAttribution] = useState('');
//   const [loading, setLoading] = useState(false);
//   // Store into local storage if the attribution survey was completed by the customer.
//   const [attributionSubmitted, setAttributionSubmitted] = useStorageState('attribution-submitted')

//   async function handleSubmit() {
//     // Simulate a server request
//     setLoading(true);
//     return new Promise<void>((resolve) => {
//       setTimeout(() => {
//       // Send the review to the server
//       console.log('Submitted:', attribution);
//       setLoading(false);
//       setAttributionSubmitted(true)
//       resolve();
//     }, 750)});
//   }

  // Hides the survey if the attribution has already been submitted
//   if (attributionSubmitted.loading || attributionSubmitted.data === true) {
//     return null;
//   }

//   return (
//     <Survey title="How did you hear about us ?" onSubmit={handleSubmit} loading={loading} description={undefined}>
//       <ChoiceList
//         name="sale-attribution"
//         value={attribution}
//         onChange={(value: string) => setAttribution(value)}
//       >
//         <BlockStack>
//           <Choice id="tv">TV</Choice>
//           <Choice id="podcast">Podcast</Choice>
//           <Choice id="family">From a friend or family member</Choice>
//           <Choice id="tiktok">Tiktok</Choice>
//         </BlockStack>
//       </ChoiceList>
//     </Survey>
//   );
// }

// function ProductReview() {
//   const [productReview, setProductReview] = useState('');
//   const [loading, setLoading] = useState(false);
//   // Store into local storage if the product was reviewed by the customer.
//   const [productReviewed, setProductReviewed] = useStorageState('product-reviewed')

//   async function handleSubmit() {
//     // Simulate a server request
//     setLoading(true);
//     return new Promise<void>((resolve) => {
//       setTimeout(() => {
//       // Send the review to the server
//       console.log('Submitted:', productReview);
//       setLoading(false);
//       setProductReviewed(true);
//       resolve();
//     }, 750)});
//   }

  // Hides the survey if the product has already been reviewed
//   if (productReviewed.loading || productReviewed.data) {
//     return null;
//   }

//   return (
//     <Survey
//       title="How do you like your purchase?"
//       description="We would like to learn if you are enjoying your purchase."
//       onSubmit={handleSubmit}
//       loading={loading}
//     >
//       <ChoiceList
//         name="product-review"
//         value={productReview}
//         onChange={(value: string) => setProductReview(value)}
//       >
//         <BlockStack>
//           <Choice id="5">Amazing! Very happy with it.</Choice>
//           <Choice id="4">It's okay, I expected more.</Choice>
//           <Choice id="3">Eh. There are better options out there.</Choice>
//           <Choice id="2">I regret the purchase.</Choice>
//         </BlockStack>
//       </ChoiceList>
//     </Survey>
//   );
// }

// function Survey({
//   title,
//   description,
//   onSubmit,
//   children,
//   loading,
// }) {
//   const [submitted, setSubmitted] = useState(false);

//   async function handleSubmit() {
//     await onSubmit();
//     setSubmitted(true);
//   }

//   if (submitted) {
//     return (
//       <View border="base" padding="base" borderRadius="base">
//         <BlockStack>
//           <Heading>Thanks for your feedback!</Heading>
//           <Text>Your response has been submitted</Text>
//         </BlockStack>
//       </View>
//     );
//   }

//   return (
//     <View border="base" padding="base" borderRadius="base">
//       <BlockStack>
//         <Heading>{title}</Heading>
//         <Text>{description}</Text>
//         {children}
//         <Button kind="secondary" onPress={handleSubmit} loading={loading}>
//           Submit feedback
//         </Button>
//       </BlockStack>
//     </View>
//   );
// }

function Extension() {
  const { query } = useApi();
  const target = useCartLineTarget();
  const [checkoutMessage, setCheckoutMessage] = useState<string | null>(null);

  useEffect(() => {
    async function getProductCheckoutMessage() {
      const result = await query<{
        product: {
          metafield: {
            value: string
          } | null
        }
      }>(`{
        product(id: "${target.merchandise.product.id}") {
          metafield(namespace: "custom", key: "checkout_message") {
            value
          }
        }
      }`);

      if (!result.errors) {
        if(result.data.product.metafield) {
          setCheckoutMessage(result.data.product.metafield.value);
        }
      } else {
        console.log(result.errors)
      }
    }

    getProductCheckoutMessage()
  }, []);

  if (!checkoutMessage) return null;

  return (
    <Text emphasis='bold' size='small'>{checkoutMessage}</Text>
  );
}

function useStorageState(arg0: string): [any, any] {
  throw new Error('Function not implemented.');
}
