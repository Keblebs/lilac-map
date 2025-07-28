import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import cors from "cors";

const env = process.env.NODE_ENV || 'homolog';
dotenv.config({ path: `.env.${env}` });


const app = express();
app.use(express.json())
app.use(cors())

app.get("/get_files/:protocol", async (req, res) => {
    const meta_request = axios.create({
        baseURL: process.env.METABASE_URL,
        headers: {
            "Content-Type": "application/json",
        },
    });

    let aut = '';
    try {
        let response = await meta_request.post("/api/session", {
            username: process.env.METABASE_USER,
            password: process.env.METABASE_PASSWORD,
        });
        aut = response.data.id;
    } catch (error) {
        console.error("Erro ao autenticar no Metabase:", error);
        return res.status(500).send("Erro de autenticação no Metabase.");
    }

    const meta = axios.create({
        baseURL: process.env.METABASE_URL,
        headers: {
            'Content-Type': 'application/json',
            'X-Metabase-Session': aut,
        },
    });

    try {
        let response = await meta.post(`/api/card/${process.env.METABASE_CARD}/query`, {
            ignore_cache: false,
            collection_preview: false,
            parameters: [
                {
                    id: "e3d8adf4-85bc-4693-8d5e-71596c85a185",
                    type: "category",
                    value: "" + req.params.protocol,
                    target: ["variable", ["template-tag", "protocolo"]],
                }
            ]
        });

        return res.status(200).json(response.data.data.rows);
    } catch (error) {
        console.error("Erro ao buscar dados do Metabase:", error);
        return res.status(500).send("Erro ao buscar dados.");
    }
});


app.get("/get_id/:identificador", async (req, res) => {
    const meta_request = axios.create({
        baseURL: process.env.METABASE_URL,
        headers: {
            "Content-Type": "application/json",
        },
    });

    let aut = '';
    try {
        let response = await meta_request.post("/api/session", {
            username: process.env.METABASE_USER,
            password: process.env.METABASE_PASSWORD,
        });
        aut = response.data.id;
    } catch (error) {
        console.error("Erro ao autenticar no Metabase:", error);
        return res.status(500).send("Erro de autenticação no Metabase.");
    }

    const meta = axios.create({
        baseURL: process.env.METABASE_URL,
        headers: {
            'Content-Type': 'application/json',
            'X-Metabase-Session': aut,
        },
    });

    try {
        let response = await meta.post(`/api/card/${process.env.METABASE_GET_ID_CARD}/query`, {
            "ignore_cache": false,
            "collection_preview": false,
            "parameters": [
                {
                    "id": "3584a6a1-cb55-4f2f-b118-3245e9cd4e00",
                    "type": "category",
                    "value": "" + req.params.identificador,
                    "target": [
                        "variable",
                        [
                            "template-tag",
                            "identificador"
                        ]
                    ]
                }
            ]
        });

        return res.status(200).json(response.data.data.rows);
    } catch (error) {
        console.error("Erro ao buscar dados do Metabase:", error);
        return res.status(500).send("Erro ao buscar dados.");
    }
});


app.listen(process.env.PORT, () => console.log(`Example app listening on port ${process.env.PORT}!`));