import { createClient } from '@sanity/client';
const client = createClient({
  projectId: 'vn3iz3iz',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03'
});
client.fetch(`*[_type == "comparativo"]`).then(res => {
  const slugs = res.map(r => r.slug.current);
  const duplicates = slugs.filter((item, index) => slugs.indexOf(item) !== index);
  console.log('Duplicates:', duplicates);
});
