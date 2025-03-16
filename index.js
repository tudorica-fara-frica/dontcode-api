// const fs = require("node:fs");
const express = require("express");
const app = express();

// const admin = require("firebase-admin");
const serviceAccount = require("./service-account.json");
const { getApps, getApp, initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

const adminApp =
  getApps().length > 0
    ? getApp()
    : initializeApp({ credential: cert(serviceAccount) });
const adminDB = getFirestore(adminApp);

app.use(express.json());

app
  .get("/api/v1/:code", async (req, res) => {
    // console.log(`GET request for code: ${req.params.code}`);

    try {
      const docRef = adminDB.collection("dontcode").doc(req.params.code);
      const docSnap = await docRef.get();

      if (!docSnap.exists) {
        return res.status(404).json({ error: "Document not found" });
      }

      const content = docSnap.data().content;

      res.status(200).json({ content });
    } catch (err) {
      // console.log("Error fetching document:", err);
      res.status(500).json({ error: "internal Server Error" });
    }
  })
  .put("/api/v1/:code", async (req, res) => {
    // console.log(`PUT request for code: ${req.params.code}`);

    if (!req.body.overwrite) {
      try {
        const docRef = adminDB.collection("dontcode").doc(req.params.code);
        const docSnap = await docRef.get();

        let newContent;
        const formattedDate = new Date().toLocaleString();

        if (docSnap.exists) {
          const oldContent = docSnap.data().content;
          newContent = `${oldContent}\n\n----content uploaded at ${formattedDate}----\n${req.body.content}`;
        } else {
          newContent = `----content uploaded at ${formattedDate}----\n${req.body.content}`;
        }

        await docRef.set({ content: newContent }, { merge: true });

        res.status(200).json({ message: "Content updated successfully!" });
      } catch (err) {
        // console.log("Error updating document:", err);
        res.status(500).json({ error: "Internal Server Error" });
      }
    } else {
      try {
        const docRef = adminDB.collection("dontcode").doc(req.params.code);

        await docRef.set({ content: req.body.content }, { merge: true });

        res.status(200).json({ message: "Content updated successfully!" });
      } catch (err) {
        // console.log("Error updating document:", err);
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  });

app.listen(8080, () => {
  // console.log("Server running on port 8080");
});
