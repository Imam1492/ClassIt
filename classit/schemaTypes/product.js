// This is the UPDATED blueprint for our products
export default {
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      // This is a new, powerful field for creating URL-friendly names
      // e.g., "Men Tan Boots" becomes "men-tan-boots"
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title', // It will auto-generate from the title field
        maxLength: 96,
      },
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
    },
    {
      name: 'link', // Changed this from 'buyLink' to match your original structure
      title: 'Link',
      type: 'url',
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
    }
  ],
}