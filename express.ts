// @ts-nocheck
import Bundlr from  "@bundlr-network/client"

import { programs } from "@metaplex/js";
import {
  Connection,
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  Transaction,
} from "@solana/web3.js";
import cors from "cors";
import fetch from "node-fetch";
import { AnchorProvider, Program } from "@project-serum/anchor";
import express from "express";
import fs from "fs";
import bs58 from "bs58";
import bodyParser from "body-parser";
let devwallie = Keypair.fromSecretKey(bs58.decode(process.env.WALLIE));

let app = new express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
import axios from "axios";
import { NodeWallet } from "@project-serum/common";
import { Configuration, OpenAIApi } from "openai";
console.log(process.env.OPENAI_API_KEY);
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

let hehe = {
  sellerFeeBasisPoints: 0,
  share: 100,
  uri: "",
  attributes: [
    {
      trait_type: "COPE",
      value: "0",
    },
    {
      trait_type: "start_date",
      value: new Date().toString(),
    },
    {
      trait_type: "end_date",
      value: new Date(
        new Date().getTime() + 1000 * 60 * 60 * 24 * 30
      ).toString(),
    },
  ],
  name: "test",
  symbol: "",
  description: "",
  seller_fee_basis_points: 100,

  image:
    "https://www.arweave.net/5KuC6xC2mqDuS52EToL6eeASz8wD3SBFDW9UbM41Yhg?ext=png",
  external_url: "",
  properties: {
    files: [
      {
        uri: "https://www.arweave.net/5KuC6xC2mqDuS52EToL6eeASz8wD3SBFDW9UbM41Yhg?ext=png",
        type: "image/png",
      },
    ],
    category: "image",
    creators: [
      {
        address: new PublicKey("HTwypueDnRQBtNbwj4dXjZtEbmAiqTKGNe7hgDT4u4tL"),
        share: 100,
        verified: true,
        isOwner: true,
        total: 1,
      },
    ],
  },
};
import * as stream from 'stream';
import { promisify } from 'util';


const DwebLink = (cid) => `https://${cid}.ipfs.dweb.link`;
import { promises as fs } from "fs";

app.post("/handle", async (request, res) => {
  console.log(request.body);
  try {
    let fanout = request.body.fanout;
    let nft = request.body.nft;
    let tx = new Transaction();
    let connection = new Connection(
      request.body.environment.label != "devnet"
        ? "https://solana-mainnet.g.alchemy.com/v2/WM_Gl7ktiws7icLQVxLP5iVHNQTv8RNk"
        : "https://solana-devnet.g.alchemy.com/v2/4Q5FSmnGz3snzIr01s-ZNwAtdFdnDB9L",

      "singleGossip"
    );
    const metadatas = await programs.metadata.Metadata.findByMint(
      connection,
      new PublicKey(nft)
    );
    const who = new PublicKey(request.body.who);
    console.log(metadatas);
    const metadata = metadatas.pubkey;
    let data = metadatas.data;
    let offchaindata;
    try {
      offchaindata = await await axios.get(data.data.uri);
    } catch (err) {
      offchaindata = { data: hehe };
    }
    offchaindata.data.creators = data.data.creators;
    //@ts-ignore
    const body = offchaindata.data;
    let good = false;
    for (var att of body.attributes) {
      if (att.trait_type == request.body.to.split("-")[0]) {
        att.value = (request.body.val / 10 ** 6).toString();
      }
      if (att.trait_type == "end_date") {
        att.value = new Date(
          new Date().getTime() + 1000 * 60 * 60 * 24 * 30
        ).toString();
      }
      if (att.trait_type == "prompt") {
        good = true;
        att.value = request.body.prompt;
      }
    }
    if (!good) {
      body.attributes.push({
        trait_type: "prompt",
        value: request.body.prompt,
      });
    }
    let ress 
    console.log(body);
    let response = await fetch(body.image);
    let blob = await response.blob();

    let arrayBuffer = await blob.arrayBuffer();

let buffer = Buffer.from(arrayBuffer);
let dt= new Date()+'.png'
await fs.writeFileSync(dt, buffer)


        ress = await openai.createImageVariation(
          fs.createReadStream(dt),
          1,
          "256x256"
        );
        let image_url = ress.data.data[0].url;
         response = await fetch(image_url);
         blob = await response.blob();
    
     arrayBuffer = await blob.arrayBuffer();
    
     buffer = Buffer.from(arrayBuffer);
     let dt2 = new Date()+'.png'
    await fs.writeFileSync(dt2, buffer)
try {
        ress = await openai.createImage({prompt: request.body.prompt, n: 1, size: '256x256'})

      } catch(err){
        console.log(err.response.data)
      }
        let image_url2 = ress.data.data[0].url;
        response = await fetch(image_url2);
        blob = await response.blob();
   
    arrayBuffer = await blob.arrayBuffer();
   
    buffer = Buffer.from(arrayBuffer);
    let dt3 = new Date()+'.png'
    await fs.writeFileSync(dt3, buffer)
try {
        ress = await openai.createImageEdit(
          fs.createReadStream(dt2),
          fs.createReadStream(dt3),
          request.body.prompt,
          1,
          "256x256"
        );
} catch(err){
  console.log(err.data)
}
        image_url = ress.data.data[0].url;
        response = await fetch(image_url);
        blob = await response.blob();
   
    arrayBuffer = await blob.arrayBuffer();
   
    buffer = Buffer.from(arrayBuffer);
    let dt138 = new Date()+'.png'
    await fs.writeFileSync(dt138, buffer)
    try {
      const bundlr = new Bundlr("https://node1.bundlr.network", "solana", devwallie.secretKey, { providerUrl: "https://solana-mainnet.g.alchemy.com/v2/WM_Gl7ktiws7icLQVxLP5iVHNQTv8RNk" });
      let recipeBuffer = fs.readFileSync(dt138)
     
       const tx = bundlr.createTransaction(recipeBuffer)
     
       // want to know how much you'll need for an upload? simply:
       // get the number of bytes you want to upload
       const size = tx.size
       // query the bundlr node to see the price for that amount
       const cost = await bundlr.getPrice(size);
       const fundStatus = await bundlr.fund(Math.ceil(cost.toNumber()))
       console.log(fundStatus)
       // sign the transaction
       await tx.sign()
       // get the transaction's ID:
       const id = tx.id
       // upload the transaction
       const result = await tx.upload()
       const link = `https://arweave.net/${result.id}`;
       body.image = link;

      console.log(image_url);
      const response = await fetch("https://api.nft.storage/upload", {
        //@ts-ignore
        body: JSON.stringify(body),
        method: "POST",
        headers: {
          Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDdEQUY5M2RjM0M4NDk2RkJCNDI2OTJkZTllZTQ1ZjMzYTU0QTQ0MjgiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY0ODE2NTAzODU2MywibmFtZSI6InRlc3QifQ.N-O3tRZHsFo3T8UXC0pOElITz5iCK2ABCjRCxd3yFt0"}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      let json = await response.json();
      // @ts-ignore
      let uri2 = DwebLink(json.value.cid) + `?ext=json`;
      //  uri2 = (new Uint8Array (( crypto.createHash('md5').update(json.value.cid, 'utf-8').digest()))).toString()
      //    console.log(uri2)
      //   console.log(uri2.length)
      let hm = [];
      for (var i = 0; i < uri2.split(",").length; i++) {
        hm.push(parseInt(uri2.split(",")[i]));
      }
      console.log(hm);
      // @ts-ignore
      console.log(json.value.cid);
      const [newUri, newUriBump] = await PublicKey.findProgramAddress(
        [
          Buffer.from("upgrad00r-new-uri"),
          new PublicKey(fanout).toBuffer(),
          who.toBuffer(),
        ],
        new PublicKey("84zHEoSwTo6pb259RtmeYQ5KNStik8pib815q7reZjdx")
      );
      // @ts-ignore
      let provider = new AnchorProvider(
        connection,
        new NodeWallet(devwallie),
        {}
      );
      const idl = await Program.fetchIdl(
        new PublicKey("84zHEoSwTo6pb259RtmeYQ5KNStik8pib815q7reZjdx"),
        provider
      );

      // @ts-ignore
      const program = new Program(
        idl as Idl,
        new PublicKey("84zHEoSwTo6pb259RtmeYQ5KNStik8pib815q7reZjdx"),
        provider
      ) as Program<any>;

      let tx = new Transaction().add(
        await program.instruction.processSubmitUri(
          // @ts-ignore
          { uri: json.value.cid, bump: newUriBump },
          {
            accounts: {
              authority: devwallie.publicKey,
              fanout: new PublicKey(fanout),
              wallet: who,
              newUri,
              systemProgram: SystemProgram.programId,
              rentKey: SYSVAR_RENT_PUBKEY,
            },
          }
        )
      );

      // @ts-ignore
      body.uri = json.value.cid; //uri2
      body.sellerFeeBasisPoints = body.seller_fee_basis_points;
      console.log(body);

      tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
      tx.feePayer = devwallie.publicKey;

      setTimeout(async function () {
        let tx = new Transaction().add(
          await program.instruction.processDrainEmAll({
            accounts: {
              authority: devwallie.publicKey,
              fanout: new PublicKey(fanout),
              user: who,
              newUri,
            },
          })
        );

        tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
        tx.feePayer = devwallie.publicKey;
        try {
          let urg = await sendAndConfirmTransaction(connection, tx, [
            devwallie,
          ]);
          console.log(urg);
        } catch (err) {
          console.log(err);
        }
      }, 60999);
      try {
        let urg = sendAndConfirmTransaction(connection, tx, [devwallie]);
        console.log(urg);
      } catch (err) {
        console.log(err);
      }
      console.log(devwallie.publicKey.toBase58());

      console.log(newUri.toBase58());
      // @ts-ignore
      res.json({ pubkey: newUri, body });
      //json.value.cid)))//(json.value.cid))
    } catch (error) {
      console.error(error);
      res.json({
        uri: undefined,
      });
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.listen(process.env.PORT || 8080);
