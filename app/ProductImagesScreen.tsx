import React, { useEffect, useLayoutEffect, useState } from "react";
import { View, Image, FlatList, Button, Alert, StyleSheet, TouchableOpacity, Modal } from "react-native";
import * as ImagePicker from "expo-image-picker";
import api from "./lib/api";
import { useNavigation, useRoute } from '@react-navigation/native';
import { useHeaderHeight } from '@react-navigation/elements';
import { MaterialIcons } from "@expo/vector-icons";
import { Text } from "react-native-paper";

const ProductImages = () => {
    const [images, setImages] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();
    const route = useRoute();
    const { productId } = route.params || {}; // Get the productId from the navigation route
    const headerHeight = useHeaderHeight();  // Get the height of the header
    const [selectedImage, setSelectedImage] = useState(null);
    // Fetch images from API
    const fetchImages = async () => {
        try {
            const response = await api.get(`/products/${productId}/images`);
            setImages(response.data);
        } catch (error) {
            console.error("Error fetching images:", error);
        }
    };

    // Handle image selection and upload
    const uploadImages = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                allowsMultipleSelection: true,
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
            });

            if (!result.canceled) {
                const formData = new FormData();
                result.assets.forEach((asset) => {
                    formData.append("images[]", {
                        uri: asset.uri,
                        name: asset.fileName || asset.uri.split("/").pop(),
                        type: asset.type || "image/jpeg",
                    });
                });

                setUploading(true);
                const response = await api.post(`/products/${productId}/images/upload`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                setImages([...images, ...response.data]);
                Alert.alert("Success", "Images uploaded successfully");
            }
        } catch (error) {
            // console.error("Error uploading images:", error.response.data);
            Alert.alert("Error", "Failed to upload images");
        } finally {
            setUploading(false);
        }
    };

    // Handle image deletion
    const deleteImage = async (imageId) => {
        try {
            await api.delete(`/products/${productId}/images/${imageId}`);
            setImages(images.filter((img) => img.id !== imageId));
            Alert.alert("Success", "Image deleted successfully");
        } catch (error) {
            console.error("Error deleting image:", error);
            Alert.alert("Error", "Failed to delete image");
        }
    };


    useEffect(() => {

        navigation.setOptions({
            headerTitle: productId ? 'Edit Product' : 'Create Product',
        });


        if (productId) {
            // console.log(productId)
            //   // Fetch the product data if in edit mode
            fetchImages();

        }

        // fetchUnitsAndCategories(); // Fetch units and categories
    }, [productId, navigation]);



    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={uploadImages} disabled={uploading} >
                    {/* <Text style={{ color: '#fff', fontWeight: 'light', fontSize: 18, marginEnd: 5 }}>+</Text> */}
                    <MaterialIcons name="add" size={25} color="#fff" style={{}} />
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    return (
        <View style={[styles.container, { marginTop: headerHeight }]}>
            <FlatList
                data={images}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.imageContainer}>
                        <TouchableOpacity onPress={() => setSelectedImage(item.full_location)}>
                            <Image
                                source={{ uri: item.full_location }}
                                style={styles.image}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => deleteImage(item.id)}
                            style={styles.deleteIconContainer}
                        >
                            <MaterialIcons name="close" size={25} color="white" />
                        </TouchableOpacity>
                    </View>
                )}
                contentContainerStyle={styles.listContainer}
            />


            {/* Modal for Full Image View */}
            <Modal visible={!!selectedImage} transparent={true}>
                <View style={styles.modalContainer}>
                    <TouchableOpacity
                        style={styles.modalCloseButton}
                        onPress={() => setSelectedImage(null)}
                    >
                        <MaterialIcons name="close" size={30} color="white" />
                    </TouchableOpacity>
                    <Image source={{ uri: selectedImage }} style={styles.fullImage} />
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#fff",
    },
    listContainer: {
        flexDirection: "row",
        flexWrap: 'wrap',
        justifyContent: "space-between",
    },
    imageContainer: {
        position: "relative",
        marginBottom: 16,
        alignItems: "center",
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 12,
        borderColor: "#ddd",
        borderWidth: 1,
        backgroundColor: "#f9f9f9",
    },
    deleteIconContainer: {
        position: "absolute",
        top: 5,
        right: 5,
        backgroundColor: "red",
        borderRadius: 20,
        padding: 5,
        zIndex: 10,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalCloseButton: {
        position: "absolute",
        top: 40,
        right: 20,
        zIndex: 10,
    },
    fullImage: {
        width: "90%",
        height: "70%",
        resizeMode: "contain",
        borderRadius: 12,
    },
});

export default ProductImages;
