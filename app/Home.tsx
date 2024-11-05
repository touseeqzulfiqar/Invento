import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput as RNTextInput,
  Modal,
  TouchableOpacity,
  Image,
} from "react-native";
import { auth, db } from "../firebase";
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
import * as ImagePicker from "expo-image-picker";
import MyButton from "@/components/MyButton";

const Home = () => {
  const [product, setProduct] = useState<string>("");
  const [productImage, setProductImage] = useState<string | null>(null); // Allow null
  const [productsList, setProductsList] = useState<any[]>([]);
  const [editingProductId, setEditingProductId] = useState<string | null>(null); // Allow null
  const [editedProductName, setEditedProductName] = useState<string>("");
  const [editedProductImage, setEditedProductImage] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null); // Allow null
  const userId = auth.currentUser?.uid;

  const handleLogout = () => {
    auth
      .signOut()
      .then(() => {
        router.replace("/login");
      })
      .catch((error) => alert(error.message));
  };

  const addProductToFirestore = async () => {
    if (product.trim() && productImage) {
      try {
        await addDoc(collection(db, "products"), {
          name: product,
          image: productImage,
          createdAt: new Date(),
          ownerId: userId,
        });
        setProduct("");
        setProductImage(null); // Reset the image after adding
      } catch (error) {
        alert(error.message);
      }
    } else {
      alert("Please provide both a product name and image.");
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

  const deleteProduct = async (id: string) => {
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

  const confirmDelete = (id: string, ownerId: string) => {
    if (ownerId !== userId) {
      alert("You can only delete your own products.");
      return;
    }
    setProductToDelete(id);
    setShowDeleteModal(true);
  };

  const updateProduct = async (id: string) => {
    try {
      await updateDoc(doc(db, "products", id), {
        name: editedProductName,
        image: editedProductImage,
      });
      setEditingProductId(null);
      setEditedProductName("");
      setEditedProductImage(null); // Reset the image after editing
    } catch (error) {
      alert(error.message);
    }
  };

  const openEditModal = (id: string, name: string, image: string) => {
    setEditingProductId(id);
    setEditedProductName(name);
    setEditedProductImage(image);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProductImage(result.assets[0].uri);
    }
  };


  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <TouchableOpacity onPress={pickImage}>
          <Icon name="image" size={25} />
        </TouchableOpacity>
        <RNTextInput
          placeholder="Enter Product Name"
          style={styles.input}
          value={product}
          onChangeText={setProduct}
          onSubmitEditing={addProductToFirestore}
        />
      </View>

      {productImage && (
        <Image source={{ uri: productImage }} style={styles.imagePreview} />
      )}

      <FlatList
        data={productsList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.productItem}>
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <Text style={styles.productText}>{item.name}</Text>
            {item.ownerId === userId && (
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  onPress={() => openEditModal(item.id, item.name, item.image)}
                >
                  <Icon name="edit" size={20} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => confirmDelete(item.id, item.ownerId)}
                >
                  <Icon name="trash" size={20} />
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      />

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
              <TouchableOpacity
                onPress={() => {
                  if (productToDelete) deleteProduct(productToDelete);
                }}
              >
                <Text>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowDeleteModal(false)}>
                <Text>Cancel</Text>
              </TouchableOpacity>
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
            <View style={styles.modalInputContainer}>
              <RNTextInput
                style={styles.modalInput}
                value={editedProductName}
                onChangeText={setEditedProductName}
              />
            </View>
            {editedProductImage && (
              <Image
                source={{ uri: editedProductImage }}
                style={styles.imagePreview}
              />
            )}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => {
                  updateProduct(editingProductId!);
                }}
              >
                <Text>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setEditingProductId(null)}>
                <Text>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <MyButton title={"Logout"} onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    // alignItems: "center",
    rowGap: 20,
    paddingRight: 50,
    paddingLeft: 20,
    paddingTop: 50,
  },
  input: {
    borderWidth: 1,
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 20,
    width: "100%",
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginVertical: 10,
  },
  productItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    justifyContent: "space-between",
  },
  productImage: {
    width: 100,
    height: 80,
    borderRadius: 5,
    marginRight: 10,
  },
  productText: {
    flex: 1,
    fontFamily: "sans-serif",
    fontStyle: "italic",
    fontSize: 16,
    marginLeft: 10,
    marginRight: 10,
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
    justifyContent: "space-between",
    gap: 5,
  },
  modalContent: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    elevation: 5,
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
    paddingHorizontal: 20,
    width: "100%",
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: "row",
    padding: 15,
    justifyContent: "space-between",
    width: "100%",
  },
});

export default Home;
