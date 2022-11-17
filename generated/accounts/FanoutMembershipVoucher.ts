/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as web3 from '@solana/web3.js'
import * as beet from '@metaplex-foundation/beet'
import * as beetSolana from '@metaplex-foundation/beet-solana'

/**
 * Arguments used to create {@link FanoutMembershipVoucher}
 * @category Accounts
 * @category generated
 */
export type FanoutMembershipVoucherArgs = {
  fanout: web3.PublicKey
  totalInflow: beet.bignum
  lastInflow: beet.bignum
  bumpSeed: number
  membershipKey: web3.PublicKey
  shares: beet.bignum
}

export const fanoutMembershipVoucherDiscriminator = [
  185, 62, 74, 60, 105, 158, 178, 125,
]
/**
 * Holds the data for the {@link FanoutMembershipVoucher} Account and provides de/serialization
 * functionality for that data
 *
 * @category Accounts
 * @category generated
 */
export class FanoutMembershipVoucher implements FanoutMembershipVoucherArgs {
  private constructor(
    readonly fanout: web3.PublicKey,
    readonly totalInflow: beet.bignum,
    readonly lastInflow: beet.bignum,
    readonly bumpSeed: number,
    readonly membershipKey: web3.PublicKey,
    readonly shares: beet.bignum
  ) {}

  /**
   * Creates a {@link FanoutMembershipVoucher} instance from the provided args.
   */
  static fromArgs(args: FanoutMembershipVoucherArgs) {
    return new FanoutMembershipVoucher(
      args.fanout,
      args.totalInflow,
      args.lastInflow,
      args.bumpSeed,
      args.membershipKey,
      args.shares
    )
  }

  /**
   * Deserializes the {@link FanoutMembershipVoucher} from the data of the provided {@link web3.AccountInfo}.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static fromAccountInfo(
    accountInfo: web3.AccountInfo<Buffer>,
    offset = 0
  ): [FanoutMembershipVoucher, number] {
    return FanoutMembershipVoucher.deserialize(accountInfo.data, offset)
  }

  /**
   * Retrieves the account info from the provided address and deserializes
   * the {@link FanoutMembershipVoucher} from its data.
   *
   * @throws Error if no account info is found at the address or if deserialization fails
   */
  static async fromAccountAddress(
    connection: web3.Connection,
    address: web3.PublicKey,
    commitmentOrConfig?: web3.Commitment | web3.GetAccountInfoConfig
  ): Promise<FanoutMembershipVoucher> {
    const accountInfo = await connection.getAccountInfo(
      address,
      commitmentOrConfig
    )
    if (accountInfo == null) {
      throw new Error(
        `Unable to find FanoutMembershipVoucher account at ${address}`
      )
    }
    return FanoutMembershipVoucher.fromAccountInfo(accountInfo, 0)[0]
  }

  /**
   * Provides a {@link web3.Connection.getProgramAccounts} config builder,
   * to fetch accounts matching filters that can be specified via that builder.
   *
   * @param programId - the program that owns the accounts we are filtering
   */
  static gpaBuilder(
    programId: web3.PublicKey = new web3.PublicKey(
      'GR8qnkCuwBM3aLkAdMQyy3n6NacecPha7xhwkmLEVNBM'
    )
  ) {
    return beetSolana.GpaBuilder.fromStruct(
      programId,
      fanoutMembershipVoucherBeet
    )
  }

  /**
   * Deserializes the {@link FanoutMembershipVoucher} from the provided data Buffer.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static deserialize(
    buf: Buffer,
    offset = 0
  ): [FanoutMembershipVoucher, number] {
    return fanoutMembershipVoucherBeet.deserialize(buf, offset)
  }

  /**
   * Serializes the {@link FanoutMembershipVoucher} into a Buffer.
   * @returns a tuple of the created Buffer and the offset up to which the buffer was written to store it.
   */
  serialize(): [Buffer, number] {
    return fanoutMembershipVoucherBeet.serialize({
      accountDiscriminator: fanoutMembershipVoucherDiscriminator,
      ...this,
    })
  }

  /**
   * Returns the byteSize of a {@link Buffer} holding the serialized data of
   * {@link FanoutMembershipVoucher}
   */
  static get byteSize() {
    return fanoutMembershipVoucherBeet.byteSize
  }

  /**
   * Fetches the minimum balance needed to exempt an account holding
   * {@link FanoutMembershipVoucher} data from rent
   *
   * @param connection used to retrieve the rent exemption information
   */
  static async getMinimumBalanceForRentExemption(
    connection: web3.Connection,
    commitment?: web3.Commitment
  ): Promise<number> {
    return connection.getMinimumBalanceForRentExemption(
      FanoutMembershipVoucher.byteSize,
      commitment
    )
  }

  /**
   * Determines if the provided {@link Buffer} has the correct byte size to
   * hold {@link FanoutMembershipVoucher} data.
   */
  static hasCorrectByteSize(buf: Buffer, offset = 0) {
    return buf.byteLength - offset === FanoutMembershipVoucher.byteSize
  }

  /**
   * Returns a readable version of {@link FanoutMembershipVoucher} properties
   * and can be used to convert to JSON and/or logging
   */
  pretty() {
    return {
      fanout: this.fanout.toBase58(),
      totalInflow: (() => {
        const x = <{ toNumber: () => number }>this.totalInflow
        if (typeof x.toNumber === 'function') {
          try {
            return x.toNumber()
          } catch (_) {
            return x
          }
        }
        return x
      })(),
      lastInflow: (() => {
        const x = <{ toNumber: () => number }>this.lastInflow
        if (typeof x.toNumber === 'function') {
          try {
            return x.toNumber()
          } catch (_) {
            return x
          }
        }
        return x
      })(),
      bumpSeed: this.bumpSeed,
      membershipKey: this.membershipKey.toBase58(),
      shares: (() => {
        const x = <{ toNumber: () => number }>this.shares
        if (typeof x.toNumber === 'function') {
          try {
            return x.toNumber()
          } catch (_) {
            return x
          }
        }
        return x
      })(),
    }
  }
}

/**
 * @category Accounts
 * @category generated
 */
export const fanoutMembershipVoucherBeet = new beet.BeetStruct<
  FanoutMembershipVoucher,
  FanoutMembershipVoucherArgs & {
    accountDiscriminator: number[] /* size: 8 */
  }
>(
  [
    ['accountDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)],
    ['fanout', beetSolana.publicKey],
    ['totalInflow', beet.u64],
    ['lastInflow', beet.u64],
    ['bumpSeed', beet.u8],
    ['membershipKey', beetSolana.publicKey],
    ['shares', beet.u64],
  ],
  FanoutMembershipVoucher.fromArgs,
  'FanoutMembershipVoucher'
)
