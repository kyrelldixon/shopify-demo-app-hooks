import store from 'store-js';
import gql from 'graphql-tag';
import { useState, useEffect } from "react";
import {
  Banner,
  Card,
  Form,
  FormLayout,
  Frame,
  Layout,
  Page,
  PageActions,
  TextField,
  Toast,
} from '@shopify/polaris';
import { useMutation } from 'react-apollo';


const UPDATE_PRICE = gql`
  mutation productVariantUpdate($input: ProductVariantInput!) {
    productVariantUpdate(input: $input) {
      product {
        title
      }
      productVariant {
        id
        price
      }
    }
  }
`;

const EditProduct = () => {
  const [discount, setDiscount] = useState('')
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [variantId, setVariantId] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [handleSubmit, { error, data }] = useMutation(UPDATE_PRICE)

  const handleDiscountChange = () => {
    return (value) => setDiscount(value)
  };

  const initialize = () => {
    const item = store.get('item');
    const price = item.variants.edges[0].node.price;
    const variantId = item.variants.edges[0].node.id;
    const name = item.title;
    const discounter = price * 0.1;
    const discount = (price - discounter).toFixed(2);
    setPrice(price);
    setVariantId(variantId);
    setName(name);
    setDiscount(discount);
  };

  useEffect(() => {
    initialize();
  }, [])

  const renderError = error && (
    <Banner status="critical">{error.message}</Banner>
  );
  const renderToast = showToast && data && data.productVariantUpdate && (
    <Toast
      content="Sucessfully updated"
      onDismiss={() => setShowToast(false)}
    />
  );
  return (
    <Frame>
      <Page>
        <Layout>
          {renderToast}
          <Layout.Section>
            {renderError}
          </Layout.Section>
          <Layout.Section>
            <Form>
              <Card title={name} sectioned>
                <FormLayout>
                  <FormLayout.Group>
                    <TextField
                      prefix="$"
                      value={price}
                      disabled={true}
                      label="Original price"
                      type="price"
                    />
                    <TextField
                      prefix="$"
                      value={discount}
                      onChange={handleDiscountChange()}
                      label="Discounted price"
                      type="discount"
                    />
                  </FormLayout.Group>
                  <p>
                    This sale price will expire in two weeks
                  </p>
                </FormLayout>
              </Card>
              <PageActions
                primaryAction={[
                  {
                    content: 'Save',
                    onAction: () => {
                      const productVariableInput = {
                        id: variantId,
                        price: discount,
                      };
                      handleSubmit({
                        variables: { input: productVariableInput },
                      });
                      setShowToast(true)
                    }
                  }
                ]}
                secondaryActions={[
                  {
                    content: 'Remove discount'
                  }
                ]}
              />
            </Form>
          </Layout.Section>
        </Layout>
      </Page>
    </Frame>
  );
}

export default EditProduct;