import { signAccessJwt } from "@livepeer/core/crypto";
import { NextApiRequest, NextApiResponse } from "next";

export type CreateSignedPlaybackBody = {
  playbackId: string;
};

export type CreateSignedPlaybackResponse = {
  token: string;
};

const accessControlPrivateKey = process.env.NEXT_PUBLIC_LIVEPEER_PRIVATE_KEY;
const accessControlPublicKey = process.env.NEXT_PUBLIC_LIVEPEER_PUBLIC_KEY;

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (!accessControlPrivateKey || !accessControlPublicKey) {
      return res
        .status(500)
        .json({ message: "No private/public key configured." });
    }

    const secret = "notknownsecret";
    const { playbackId }: CreateSignedPlaybackBody = req.body;

    if (!playbackId || !secret) {
      return res.status(400).json({ message: "Missing data in body." });
    }

    // we check that the "supersecretkey" was passed in the body
    // this could be a more complex check, like taking a signed payload,
    // getting the address for that signature, and fetching if they own an NFT
    //
    // https://docs.ethers.io/v5/single-page/#/v5/api/utils/signing-key/-%23-SigningKey--other-functions

    // we sign the JWT and return it to the user
    const token = await signAccessJwt({
      privateKey: accessControlPrivateKey,
      publicKey: accessControlPublicKey,
      issuer: "https://docs.livepeer.org",
      // playback ID to include in the JWT
      playbackId,
      // expire the JWT in 1 hour
      expiration: 3 * 86400,
      // custom metadata to include
      custom: {
        userId: "user-id-1",
      },
    });

    return res.status(200).json({
      token,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: (err as Error)?.message ?? "Error" });
  }
}
