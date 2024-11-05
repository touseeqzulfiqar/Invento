import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput as RNTextInput,
  Modal,
} from "react-native";
import { auth, db } from "../firebase";
import MyButton from "@/components/MyButton";
import MyIconButton from "@/components/MyIconButton";
import { router } from "expo-router";
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import Icon from "react-native-vector-icons/FontAwesome";

const Home = () => {
  const [product, setProduct] = useState("");
  const [productsList, setProductsList] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);
  const [editedProductName, setEditedProductName] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const userId = auth.currentUser?.uid;

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        router.replace("/login");
      })
      .catch((error) => alert(error.message));
  };

  const addProductToFirestore = async () => {
    if (product.trim()) {
      try {
        await addDoc(collection(db, "products"), {
          name: product,
          createdAt: new Date(),
          ownerId: userId,
        });
        setProduct("");
      } catch (error) {
        alert(error.message);
      }
    }
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "products"), (snapshot) => {
      const products = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProductsList(products);
    });

    return () => unsubscribe();
  }, []);

  const deleteProduct = async (id) => {
    const productRef = doc(db, "products", id);
    const productDoc = await getDoc(productRef);

    if (productDoc.exists()) {
      try {
        await deleteDoc(productRef);
        setShowDeleteModal(false);
      } catch (error) {
        alert("Error deleting product: " + error.message);
      }
    } else {
      alert("Product does not exist!");
    }
  };

  const confirmDelete = (id, ownerId) => {
    if (ownerId !== userId) {
      alert("You can only delete your own products.");
      return;
    }
    setProductToDelete(id);
    setShowDeleteModal(true);
  };

  const updateProduct = async (id) => {
    try {
      await updateDoc(doc(db, "products", id), {
        name: editedProductName,
      });
      setEditingProductId(null);
      setEditedProductName("");
    } catch (error) {
      alert(error.message);
    }
  };

  const openEditModal = (id, name) => {
    setEditingProductId(id);
    setEditedProductName(name);
  };

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <RNTextInput
          placeholder="Enter Product Name"
          style={styles.input}
          value={product}
          onChangeText={setProduct}
          onSubmitEditing={addProductToFirestore}
        />
        <MyIconButton size={25} icon="plus" onPress={addProductToFirestore} />
      </View>
      <FlatList
        data={productsList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.productItem}>
            <Icon name="check" size={20} color="#4CAF50" />
            <Text style={styles.productText}>{item.name}</Text>
            {item.ownerId === userId && (
              <View style={styles.actionButtons}>
                <MyIconButton
                  size={15}
                  icon="edit"
                  onPress={() => openEditModal(item.id, item.name)}
                />
                <MyIconButton
                  icon="trash"
                  size={15}
                  onPress={() => confirmDelete(item.id, item.ownerId)}
                />
              </View>
            )}
          </View>
        )}
      />
      <MyButton title="Logout" onPress={handleSignOut} />

      <Modal
        animationType="slide"
        transparent={true}
        visible={showDeleteModal}
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Delete</Text>
            <Text>Are you sure you want to delete this product?</Text>
            <View style={styles.modalButtons}>
              <MyButton
                title="Delete"
                onPress={() => {
                  if (productToDelete) deleteProduct(productToDelete);
                }}
              />
              <MyButton
                title="Cancel"
                onPress={() => setShowDeleteModal(false)}
              />
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={editingProductId !== null}
        onRequestClose={() => setEditingProductId(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Product</Text>
            <RNTextInput
              style={styles.modalInput}
              value={editedProductName}
              onChangeText={setEditedProductName}
            />
            <View style={styles.modalButtons}>
              <MyButton
                title="Save"
                onPress={() => {
                  updateProduct(editingProductId);
                }}
              />
              <MyButton
                title="Cancel"
                onPress={() => setEditingProductId(null)}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  input: {
    borderWidth: 1,
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 20,
    width: "100%",
  },
  productItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    justifyContent: "space-between",
  },
  productText: {
    marginLeft: 10,
    flex: 1,
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalInput: {
    borderWidth: 1,
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 10,
    width: "100%",
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    width: "100%",
    gap: 10,
  },
});

export default Home;
