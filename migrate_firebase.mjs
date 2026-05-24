import fs from 'fs';

let jsx = fs.readFileSync('c:/Users/gaming/tech-briefing/src/components/pages/FerramentasPage.jsx', 'utf8');

// Remove firebase imports
jsx = jsx.replace(/import \{ db \} from '\.\.\/\.\.\/lib\/firebase';\n/, '');
jsx = jsx.replace(/import \{ collection, doc, getDocs, updateDoc, increment, setDoc, getDoc \} from 'firebase\/firestore';\n/, '');

// Replace useEffect
const oldUseEffect = `  React.useEffect(() => {
    async function fetchUpvotes() {
      try {
        const querySnapshot = await getDocs(collection(db, "tool_upvotes"));
        const counts = {};
        querySnapshot.forEach((doc) => {
          counts[doc.id] = doc.data().count;
        });
        setUpvotes(counts);
      } catch(e) {
        console.error("Error fetching upvotes:", e);
      }
    }
    fetchUpvotes();
  }, []);`;

const newUseEffect = `  React.useEffect(() => {
    async function fetchUpvotes() {
      try {
        const res = await fetch("https://firestore.googleapis.com/v1/projects/techbriefing-11b23/databases/(default)/documents/tool_upvotes");
        if (!res.ok) return;
        const json = await res.json();
        const counts = {};
        if (json.documents) {
          json.documents.forEach((doc) => {
            const id = doc.name.split('/').pop();
            counts[id] = Number(doc.fields?.count?.integerValue || 0);
          });
        }
        setUpvotes(counts);
      } catch(e) {}
    }
    fetchUpvotes();
  }, []);`;
jsx = jsx.replace(oldUseEffect, newUseEffect);

// Replace handleUpvote
const oldHandleUpvote = `  const handleUpvote = async (toolId) => {
    setUpvotes(prev => ({ ...prev, [toolId]: (prev[toolId] || 0) + 1 }));
    try {
      const docRef = doc(db, "tool_upvotes", toolId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        await updateDoc(docRef, { count: increment(1) });
      } else {
        await setDoc(docRef, { count: 1 });
      }
    } catch(e) {
      console.error("Error updating upvote:", e);
    }
  };`;

const newHandleUpvote = `  const handleUpvote = async (toolId) => {
    setUpvotes(prev => ({ ...prev, [toolId]: (prev[toolId] || 0) + 1 }));
    try {
      const payload = {
        writes: [{
          transform: {
            document: \`projects/techbriefing-11b23/databases/(default)/documents/tool_upvotes/\${toolId}\`,
            fieldTransforms: [{
              fieldPath: "count",
              increment: { integerValue: "1" }
            }]
          }
        }]
      };
      await fetch("https://firestore.googleapis.com/v1/projects/techbriefing-11b23/databases/(default)/documents:commit", {
        method: "POST",
        body: JSON.stringify(payload)
      });
    } catch(e) {}
  };`;
jsx = jsx.replace(oldHandleUpvote, newHandleUpvote);

fs.writeFileSync('c:/Users/gaming/tech-briefing/src/components/pages/FerramentasPage.jsx', jsx, 'utf8');
console.log('Migrated to REST API for Firebase');
