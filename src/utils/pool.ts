import { getPoolBonding, getPoolGov, getPoolLP } from "./infura";
import { QSDS } from "../constants/tokens";

export async function getPoolBondingAddress(): Promise<string> {
  return getPoolBonding(QSDS.addr);
}

export async function getPoolLPAddress(): Promise<string> {
  return getPoolLP(QSDS.addr);
}

export async function getPoolGovAddress(): Promise<string> {
  return getPoolGov(QSDS.addr);
}
