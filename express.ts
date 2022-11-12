import { programs } from  "@metaplex/js"
import { Connection, Keypair, PublicKey, sendAndConfirmTransaction, SystemProgram, SYSVAR_RENT_PUBKEY, Transaction } from  "@solana/web3.js"
import cors from 'cors'
import fetch from 'node-fetch'
import { AnchorProvider, Program} from '@project-serum/anchor'
import express from  'express' 
import {createProcessSubmitUriInstruction} from './generated/instructions/processSubmitUri'

import bs58 from "bs58"
import bodyParser from "body-parser"
let devwallie = Keypair.fromSecretKey(bs58.decode(process.env.WALLIE))

let app = new express()
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors())
import  axios  from  'axios' 
import { NodeWallet } from "@project-serum/common"
import { FanoutClient } from "../ui/generated"
import { connect } from "http2"
  let hehe = {
    sellerFeeBasisPoints: 0,
    share: 100,
    uri: '',
    attributes: [
      {
        trait_type: 'COPE',
        value: '0',
      },
      {
        trait_type: 'start_date',
        value: new Date().toString(),
      },
      {
        trait_type: 'end_date',
        value: new Date(
          new Date().getTime() + 1000 * 60 * 60 * 24 * 30
        ).toString(),
      },
    ],
    name: 'test',
    symbol: '',
    description: '',
    seller_fee_basis_points: 100,

    image:
      'https://www.arweave.net/5KuC6xC2mqDuS52EToL6eeASz8wD3SBFDW9UbM41Yhg?ext=png',
    external_url: '',
    properties: {
      files: [
        {
          uri: 'https://www.arweave.net/5KuC6xC2mqDuS52EToL6eeASz8wD3SBFDW9UbM41Yhg?ext=png',
          type: 'image/png',
        },
      ],
      category: 'image',
      creators: [
        {
          address: new PublicKey(
            'HTwypueDnRQBtNbwj4dXjZtEbmAiqTKGNe7hgDT4u4tL'
          ),
          share: 100,
          verified: true,
          isOwner: true,
          total: 1,
        },
      ],
    },
  }

  const DwebLink = (cid) => `https://${cid}.ipfs.dweb.link`


  app.post('/handle', async (request,res) => {
    console.log((request.body))
    try {
      let fanout = request.body.fanout
    let nft = request.body.nft
    let tx = new Transaction()
    let connection = new Connection("https://solana-devnet.g.alchemy.com/v2/4Q5FSmnGz3snzIr01s-ZNwAtdFdnDB9L", "singleGossip")
    const metadatas = (await programs.metadata.Metadata.findByMint (connection, new PublicKey(nft)));
    const who = new PublicKey(request.body.who)
    console.log(metadatas)
    const metadata = metadatas.pubkey
        let data = (metadatas.data)
        let offchaindata 
        try {
          offchaindata = await ((await axios.get(data.data.uri)))
        } catch (err){
          offchaindata  ={data: hehe}
        }
        offchaindata.data.attributes = hehe.attributes
        offchaindata.data.creators = data.data.creators
    //@ts-ignore
    const body = offchaindata.data
    try {
      const response = await fetch('https://api.nft.storage/upload', {
        //@ts-ignore
        body: JSON.stringify(body),
        method: 'POST',
        headers: {
          Authorization: `Bearer ${
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDdEQUY5M2RjM0M4NDk2RkJCNDI2OTJkZTllZTQ1ZjMzYTU0QTQ0MjgiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY0ODE2NTAzODU2MywibmFtZSI6InRlc3QifQ.N-O3tRZHsFo3T8UXC0pOElITz5iCK2ABCjRCxd3yFt0'
          }`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      let json = await response.json()
      // @ts-ignore
      let uri2 = DwebLink(json.value.cid) + `?ext=json`
   //  uri2 = (new Uint8Array (( crypto.createHash('md5').update(json.value.cid, 'utf-8').digest()))).toString()
  //    console.log(uri2)
   //   console.log(uri2.length)
      let hm = []
      for (var i = 0 ; i < uri2.split(',').length; i++){
        hm.push( parseInt(uri2.split(',')[i]))
     }
     console.log(hm)
     // @ts-ignore
    console.log((json.value.cid))
    const [newUri, newUriBump] = await PublicKey.findProgramAddress(
      [Buffer.from("fanout-new-uri"), (new PublicKey(fanout)).toBuffer(), (who.toBuffer())],
      new PublicKey("5F6oQHdPrQBLdENyhWUAE4mCUN13ZewVxi5yBnZFb9LW")
    );
// @ts-ignore
         let provider = new AnchorProvider(connection, new NodeWallet(devwallie), {})
         const idl = await Program.fetchIdl(new PublicKey("5F6oQHdPrQBLdENyhWUAE4mCUN13ZewVxi5yBnZFb9LW"), provider);
   
         // @ts-ignore
         const program = new Program(idl as Idl, new PublicKey("5F6oQHdPrQBLdENyhWUAE4mCUN13ZewVxi5yBnZFb9LW"), provider) as Program<any>;
   
         let tx = new Transaction().add(await program.instruction.processSubmitUri(
  // @ts-ignore
           {uri: json.value.cid,
          bump: newUriBump},
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
         ))

// @ts-ignore
          body.uri = json.value.cid//uri2
    body.sellerFeeBasisPoints = body.seller_fee_basis_points
    console.log(body)

    tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash
    tx.feePayer = devwallie.publicKey
   let urg =  sendAndConfirmTransaction(connection, tx, [devwallie])
   console.log(urg)
    console.log(devwallie.publicKey.toBase58())
    // @ts-ignore
    res.json(({pubkey: newUri, body}))
  //json.value.cid)))//(json.value.cid))
        
      } catch (error) {
        console.error(error)
        res.json( {
        uri: undefined
      })
    }
  } catch (err){
    console.log(err)
res.sendStatus(500)
  }
  })


  
  app.listen(process.env.PORT || 3000)