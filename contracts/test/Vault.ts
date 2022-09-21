import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import deployToken from "./helpers/deployToken";
import eth from "./helpers/eth";



describe("Vault", function () {

    async function deployVaultFixture() {
        const Vault = await ethers.getContractFactory("Vault")
        const vault = await Vault.deploy()
        return vault
    }

    describe("Deployment", function () {
        it("Should deploy", async function () {
            const vault = await loadFixture(deployVaultFixture);
            expect(vault).to.haveOwnProperty("address");
        })
    })
})