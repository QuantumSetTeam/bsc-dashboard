import { getPoolBonding, getPoolGov, getPoolLP } from "./infura";
import { SCDS } from "../constants/tokens";

export async function getPoolBondingAddress(): Promise<string> {
  return getPoolBonding(SCDS.addr);
}

export async function getPoolLPAddress(): Promise<string> {
  return getPoolLP(SCDS.addr);
}

export async function getPoolGovAddress(): Promise<string> {
  return getPoolGov(SCDS.addr);
}
