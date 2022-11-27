// @ts-nocheck
import Bundlr from  "@bundlr-network/client"
import sharp from 'sharp'
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
    let nft2 = request.body.nft2;
    let tx = new Transaction();
    let ALT_RPC_LIST = "https://solana-mainnet.g.alchemy.com/v2/1_5YWfzLWXOo_Y_Dm0s89VTlD5T_RKHn,https://solana-mainnet.g.alchemy.com/v2/QlAFXUZhGG-CoVy9r6vYAbsA7iiDnA9-,https://solana-mainnet.g.alchemy.com/v2/ETWO1_-exD_tuIyq9YTW9d37nAvNT7XQ,https://solana-mainnet.g.alchemy.com/v2/dVWUMrayL_U3UbmCbg0mouE9q4mUZfuc,https://solana-mainnet.g.alchemy.com/v2/dVWUMrayL_U3UbmCbg0mouE9q4mUZfuc,https://solana-mainnet.g.alchemy.com/v2/WM_Gl7ktiws7icLQVxLP5iVHNQTv8RNk,https://solana-mainnet.g.alchemy.com/v2/1_5YWfzLWXOo_Y_Dm0s89VTlD5T_RKHn"
    let connection = new Connection(
      request.body.environment.label != "devnet"
        ? "https://api.mainnet-beta.solana.com" //ALT_RPC_LIST.split(',')[Math.floor(Math.random() * ALT_RPC_LIST.split(',').length)]
        : "https://solana-devnet.g.alchemy.com/v2/4Q5FSmnGz3snzIr01s-ZNwAtdFdnDB9L",

      "singleGossip"
    );
    const metadatas = await programs.metadata.Metadata.findByMint(
      connection,
      new PublicKey(nft)
    );
    const metadatas2 = await programs.metadata.Metadata.findByMint(
      connection,
      new PublicKey(nft2)
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
    let data2 = metadatas2.data;
    let offchaindata2;
    try {
      offchaindata2 = await await axios.get(data.data.uri);
    } catch (err) {
      offchaindata2 = { data: hehe };
    }
    offchaindata2.data.creators = data.data.creators;
    //@ts-ignore
    const body = offchaindata.data;
    let good = false;
    try {
    for (var att of offchaindata2.data.attributes) {
      body.attributes.push(att)
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
  } catch (err){

  }
  try {
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
  } catch (err){

  }
    let ress 
    console.log(body);

    let response = await fetch(body.image);

    let blob = await response.blob();

    let arrayBuffer = await blob.arrayBuffer();

let buffer = Buffer.from(arrayBuffer);
let dt= new Date()+'.png'
await fs.writeFileSync(dt, buffer)
  response = await fetch(offchaindata2.data.image);

     blob = await response.blob();

     arrayBuffer = await blob.arrayBuffer();

 buffer = Buffer.from(arrayBuffer);
 let dt111= new Date()+'.png'

await fs.writeFileSync(dt111, buffer)
const roundedCornerResizer =await sharp(dt)
.ensureAlpha().resize(256, 256).png().toFile(dt+'1')
const roundedCornerResizer2 =await sharp(dt111)
.ensureAlpha().resize(256, 256).png().toFile(dt111+'1')
try {

ress = await openai.createImageVariation(
  fs.createReadStream(dt+'1'),
  1,
  "256x256"
);
} catch (err){
  console.log(err.response.data.error)
}
let image_url = ress.data.data[0].url;
 response = await fetch(image_url);
 blob = await response.blob();

arrayBuffer = await blob.arrayBuffer();

buffer = Buffer.from(arrayBuffer);
let dt3 = new Date()+'.png'
await sharp(buffer)
.ensureAlpha().resize(256, 256).png().toFile(dt3)
ress = await openai.createImageVariation(
  fs.createReadStream(dt111+'1'),
  1,
  "256x256"
);
 image_url = ress.data.data[0].url;
 response = await fetch(image_url);
 blob = await response.blob();

arrayBuffer = await blob.arrayBuffer();

buffer = Buffer.from(arrayBuffer);
let dt4 = new Date()+'.png'
await sharp(buffer)
.ensureAlpha().resize(256, 256).png().toFile(dt4)

try {
   ress = await openai.createImageEdit(
          fs.createReadStream(dt3),
         fs.createReadStream(dt4),
          request.body.prompt,
          1,
          "256x256"
        );
} catch(err){
  console.log(err.response.data.error)
}
        image_url = ress.data.data[0].url;
        response = await fetch(image_url);
        blob = await response.blob();
   
    arrayBuffer = await blob.arrayBuffer();
   

    buffer = Buffer.from(arrayBuffer);
    let dt138 = new Date()+'.png'
    await fs.writeFileSync(dt138, buffer)
    try {
      const bundlr = new Bundlr("https://node1.bundlr.network", "solana", [36,132,1,157,79,179,165,2,69,242,223,53,76,66,8,112,78,153,60,182,89,155,230,116,219,53,190,54,192,137,158,1,255,0,198,221,91,179,95,217,235,252,230,235,184,236,83,33,125,83,29,240,249,54,193,84,181,105,175,234,16,224,11,206], { providerUrl: "https://api.mainnet-beta.solana.com" });
      let recipeBuffer = fs.readFileSync(dt138)
     
       const tx2 = bundlr.createTransaction(recipeBuffer)
     
       // want to know how much you'll need for an upload? simply:
       // get the number of bytes you want to upload
       const size = tx2.size
       // query the bundlr node to see the price for that amount
       const cost = await bundlr.getPrice(size);
       const fundStatus = await bundlr.fund(Math.ceil(cost.toNumber()))
       console.log(fundStatus)
       // sign the transaction
       await tx2.sign()
       // get the transaction's ID:
       const id = tx2.id
       // upload the transaction
       const result = await tx2.upload()
       const link = `https://arweave.net/${result.id}`;
       body.image = link;

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
          Buffer.from("FUS00r-new-uri"),
          new PublicKey(fanout).toBuffer(),
          who.toBuffer(),
        ],
        new PublicKey("GR8qnkCuwBM3aLkAdMQyy3n6NacecPha7xhwkmLEVNBM")
      );
      // @ts-ignore
      let provider = new AnchorProvider(
        connection,
        new NodeWallet(devwallie),
        {}
      );
      const idl = await Program.fetchIdl(
        new PublicKey("GR8qnkCuwBM3aLkAdMQyy3n6NacecPha7xhwkmLEVNBM"),
        provider
      );

      // @ts-ignore
      const program = new Program(
        idl as Idl,
        new PublicKey("GR8qnkCuwBM3aLkAdMQyy3n6NacecPha7xhwkmLEVNBM"),
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
      tx.feePayer = devwallie.publicKey

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
      /*
      try {
        let urg =await sendAndConfirmTransaction(connection, tx, [devwallie]);
        console.log(urg);
      } catch (err) {
        console.log(err);
      } */
      tx.partialSign(devwallie)
      console.log(devwallie.publicKey.toBase58());

      console.log(newUri.toBase58());
      // @ts-ignore
      res.json({ pubkey: newUri, body, tx:tx.serialize({ requireAllSignatures: false} ).toString('base64')});
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
