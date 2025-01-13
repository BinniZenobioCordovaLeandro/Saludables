import {
    Image,
    StyleSheet,
    Platform,
    FlatList,
    ActivityIndicator,
    Text,
    View,
    TextInput,
    Button,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import useListData from "@/hooks/useListData";
import HealthDetail from "@/components/HealthDetail";
import { useEffect, useState } from "react";
import { ThemedText } from "@/components/ThemedText";
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { Switch } from 'react-native';

export default function HomeScreen() {
    const { items, loading, error, setListType, listType, setFilterHealth, filterHealth } = useListData();
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
                <View>
                    <ThemedView> 
                        <SegmentedControl
                            values={['Playas', 'Piscinas']}
                            selectedIndex={listType === 'beach' ? 0 : 1}
                            onChange={(event) => {
                                const index = event.nativeEvent.selectedSegmentIndex;
                                setListType(index === 0 ? 'beach' : 'pool');
                            }}
                        />
                    </ThemedView>
                    <View style={styles.row}>
                        <Switch value={filterHealth} onValueChange={setFilterHealth} />
                        <ThemedText>Solo saludables</ThemedText>
                    </View>
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
                </View>
            }
            ListEmptyComponent={
                <ThemedView style={styles.centered}>
                    <ThemedText>No se encontraron resultados</ThemedText>
                </ThemedView>
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
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
});
