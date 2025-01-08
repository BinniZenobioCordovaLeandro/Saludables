import {
    Image,
    StyleSheet,
    Platform,
    FlatList,
    ActivityIndicator,
    Text,
    View,
    TextInput,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import useListData from "@/hooks/useListData";
import HealthDetail from "@/components/HealthDetail";
import { useEffect, useState } from "react";
import { ThemedText } from "@/components/ThemedText";

export default function HomeScreen() {
    const { items, loading, error } = useListData();
    const [filter, setFilter] = useState("");
    const [filteredItems, setFilteredItems] = useState(items);

    useEffect(() => {
        if (filter !== "" && filter.length > 0) {
            setFilteredItems(
                items.filter((item) =>
                    [
                        item.strNombre.toLowerCase(),
                        item.strDepartamento.toLowerCase(),
                        item.strProvincia.toLowerCase(),
                        item.strDistrito.toLowerCase(),
                    ].join(" ").includes(filter.toLowerCase()),
                ),
            );
        } else {
            setFilteredItems(items);
        }
        return () => {};
    }, [items, filter]);

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centered}>
                <Text style={styles.errorText}>Error: {error}</Text>
            </View>
        );
    }

    return (
        <FlatList
            ListHeaderComponent={
                <View style={styles.stepContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Buscar"
                        value={filter}
                        onChangeText={setFilter}
                    />
                    <ThemedText style={styles.caption}>
                        {filteredItems.length} resultados
                    </ThemedText>
                </View>
            }
            contentContainerStyle={{
                paddingVertical: Platform.OS === "ios" ? 40 : 0,
            }}
            data={filteredItems}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <HealthDetail {...item} />}
        />
    );
}

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    stepContainer: {
        gap: 8,
        marginBottom: 8,
    },
    reactLogo: {
        height: 178,
        width: 290,
        bottom: 0,
        left: 0,
        position: "absolute",
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    errorText: {
        color: "red",
    },
    input: {
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 16,
    },
    caption: {
        textAlign: "right",
        paddingHorizontal: 16,
    },
});
