import type React from "react";
import { View, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import type { ItemWithDistance } from "@/services/models/Item";
import * as Linking from "expo-linking";
import { ThemedIcon } from "./ThemedIcon";

const evolutiveDistanceText = (distance?: number) => {
    if (!distance) return "No disponible";
    if (distance < 1000) return `${distance.toFixed(2)} m`;
    return `${(distance / 1000).toFixed(2)} km`;
};

const HealthDetail: React.FC<ItemWithDistance> = ({
    id,
    strNombre,
    strTipoPlaya,
    idDepartamento,
    idProvincia,
    idDistrito,
    strDireccion,
    strCalidadSanitaria,
    keyCalidadSanitaria,
    strDescripcion,
    dateUltimaInspeccion,
    strDepartamento,
    strProvincia,
    strDistrito,
    urlFoto,
    strSource,
    strUltimaInspeccion,
    strLatitud,
    strLongitud,
    aControles,
    distance,
}) => {
    return (
        <ThemedView
            style={[
                styles.container,
                {
                    borderColor: keyCalidadSanitaria === "ns" ? "red" : "green",
                },
            ]}
        >
            <Image
                source={{ uri: urlFoto }}
                style={styles.image}
                placeholder={require("@/assets/images/loading.gif")}
                contentFit="cover"
                transition={1000}
                onError={(e) => console.log(e)}
            />
            <ThemedView style={[styles.content]}>
                <View style={styles.row}>
                    <View style={{ flex: 1 }}>
                        <ThemedText style={styles.title}>
                            {strNombre}
                        </ThemedText>
                        <ThemedText style={styles.text}>
                            Distancia: {evolutiveDistanceText(distance)}
                        </ThemedText>
                    </View>
                    <View>
                        <ThemedIcon
                            name="flag"
                            size={50}
                            color={
                                keyCalidadSanitaria === "ns" ? "red" : "blue"
                            }
                        />
                        <ThemedIcon
                            name="route"
                            size={50}
                            onPress={() => {
                                Linking.openURL(
                                    `https://www.google.com/maps/dir/?api=1&destination=${strLatitud},${strLongitud}`,
                                );
                            }}
                        />
                    </View>
                </View>
                <View
                    style={{
                        height: 16,
                    }}
                />
                <ThemedText style={styles.text}>
                    <ThemedText style={styles.bold}>
                        Calidad Sanitaria:
                    </ThemedText>{" "}
                    {strCalidadSanitaria}
                </ThemedText>
                <ThemedText style={styles.text}>
                    <ThemedText style={styles.bold}>
                        Última Inspección:
                    </ThemedText>{" "}
                    {dateUltimaInspeccion}
                </ThemedText>
                <ThemedText style={styles.text}>
                    <ThemedText style={styles.bold}>Ubicación:</ThemedText>{" "}
                    {strDepartamento}, {strProvincia}, {strDistrito}
                </ThemedText>
                <ThemedText style={styles.subtitle}>Revisiones</ThemedText>
                <ThemedView>
                    {aControles.map((control, index) => (
                        <View
                            key={`${id}_${control.control}`}
                            style={styles.row}
                        >
                            <ThemedText>{control.control}</ThemedText>
                            {control.valor === 1 ? (
                                <ThemedIcon
                                    name="check"
                                    size={24}
                                    color="green"
                                />
                            ) : (
                                <ThemedIcon
                                    name="close"
                                    size={24}
                                    color="red"
                                />
                            )}
                        </View>
                    ))}
                </ThemedView>
            </ThemedView>
        </ThemedView>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 8,
        margin: 16,
        borderWidth: 5,
    },
    content: {
        padding: 16,
        alignItems: "flex-start",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 8,
        textAlign: "center",
    },
    image: {
        width: "100%",
        aspectRatio: 16 / 9,
        marginBottom: 8,
    },
    text: {
        fontSize: 16,
        marginBottom: 4,
        textAlign: "center",
    },
    bold: {
        fontWeight: "bold",
    },
    subtitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginTop: 16,
        marginBottom: 8,
        textAlign: "center",
    },
    row: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        alignContent: "center",
    },
});

export default HealthDetail;
