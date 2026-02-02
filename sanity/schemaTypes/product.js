export default {
  name: 'product',
  title: 'Product',
  type: 'document',

  fields: [
    {
      name: 'title',
      title: 'Product Title',
      type: 'string',
      validation: Rule => Rule.required()
    },

    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96
      }
    },

    {
      name: 'description',
      title: 'Description',
      type: 'text'
    },

    {
      name: 'price',
      title: 'Price',
      type: 'number'
    },

    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Tech', value: 'tech' },
          { title: 'Livogue', value: 'Livogue' },
          { title: 'wellfit', value: 'wellfit' }
        ]
      }
    },

    {
      name: 'image',
      title: 'Product Image',
      type: 'image',
      options: { hotspot: true }
    },

    // Add this BELOW your existing 'image' field
    {
      name: 'mobileImage',
      title: 'Mobile Image (Vertical)',
      type: 'image',
      options: {
        hotspot: true,
      },
    },

    {
      name: 'altText',
      title: 'Image Alt Text',
      type: 'string',
      description: 'Used for accessibility and SEO'
    },

    {
      name: 'link',
      title: 'Buy Link',
      type: 'url'
    }
  ]
}
