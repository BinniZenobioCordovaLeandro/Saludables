const fs = require('fs');
const myHeaders = new Headers();
myHeaders.append("accept", "application/json, text/javascript, */*; q=0.01");
myHeaders.append("accept-language", "en,es-PE;q=0.9,es;q=0.8,und;q=0.7");
myHeaders.append("content-type", "application/x-www-form-urlencoded; charset=UTF-8");

const endPoint = "https://veranosaludable.minsa.gob.pe/VF/ws2.php?";

const rawList = "rt=exa&cmd=getList&strSource=pl&idDpto=&idProv=&idDist=&strCalidadSanitaria=&strSearch=";
const rawDetail = "rt=exa&cmd=getDetail&strSource=pl&id=";

const outputFile = "services/mocks/data.json";

const writeFile = (data) => {
    fs.writeFile(outputFile, JSON.stringify(data, null, 4), (err) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log("📝 File has been created");
    });
}

fetch(endPoint, {
        method: "POST",
        headers: myHeaders,
        body: rawList,
        redirect: "follow"
    })
    .catch((error) => console.error(error))
    .then((response) => response.json())
    .then((result) => result.aRows)
    .then((data) => {
        // get detail for every item on the list according to the id, and store it as an array of data
        let detailPromises = data.map((item) => {
            return fetch(endPoint, {
            method: "POST",
            headers: myHeaders,
            body: rawDetail + item.id,
            redirect: "follow"
            })
            .then((response) => response.json())
            .then((result) => result.aRow)
            .then((data) => {
                console.log("🎸🎸🎸 item", item.id, "=> data", data);
                return data;
            })
            .catch((error) => console.error(error));
        });

        Promise.all(detailPromises)
            .then((details) => {
                let totalData = details.filter((detailResult) => detailResult !== null);
                let response = {
                    status: 200,
                    data: totalData,
                    updated: new Date().toISOString(),
                    count: totalData.length,
                }
                // write the data to a file
                writeFile(response);
            })
            .catch((error) => console.error(error));
  });
