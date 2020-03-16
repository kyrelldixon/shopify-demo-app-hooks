import store from "store-js"
import { useState } from "react"
import { EmptyState, Layout, Page } from "@shopify/polaris"
import { TitleBar, ResourcePicker } from "@shopify/app-bridge-react";

import ResourceListWithProducts from '../components/ResourceList';

const img = 'https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg';

const Index = () => {
  const [open, setOpen] = useState(false)

  const handleSelection = (resources) => {
    const idsFromResources = resources.selection.map((product) => product.id);
    setOpen(false)
    console.log(resources)
    console.log(idsFromResources)
    store.set('ids', idsFromResources)
  };

  const emptyState = !store.get('ids');

  return (
    <Page>
      <TitleBar
        primaryAction={{
          content: 'Select products',
          onAction: () => setOpen(true)
        }}
      />
      <ResourcePicker
        resourceType="Product"
        showVariants={false}
        open={open}
        onSelection={(resources) => handleSelection(resources)}
        onCancel={() => setOpen(false)}
      />
      {
        emptyState ? (
          <Layout>
            <EmptyState
              heading="Select products to start"
              action={{
                content: 'Select products',
                onAction: () => setOpen(true),
              }}
              image={img}
            >
              <p>Select products and change their price temporarily</p>
            </EmptyState>
          </Layout>
        ) : (
            <ResourceListWithProducts />
          )
      }
    </Page>
  );
}

export default Index;