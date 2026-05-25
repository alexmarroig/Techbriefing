import { createClient } from '@sanity/client';
const client = createClient({
  projectId: 'vn3iz3iz',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03'
});
client.fetch(`*[_type == "article"] | order(_createdAt desc)[0...5]{title, slug, _createdAt}`).then(console.log);
