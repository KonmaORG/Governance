"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCardano } from "@/context/CardanoContext";
import { AttachConfigDatum } from "@/lib/cardano/transactions";
import { CATEGORIES } from "@/config/constants";
import { paymentCredentialOf, stakeCredentialOf } from "@lucid-evolution/lucid";
import { TagInput } from "@/components/ui/tag-input";

interface ConfigFormData {
  fees_address: string;
  fees_amount: string;
  fees_asset_policy_id: string;
  fees_asset_name: string;
  spend_address: string;
  categories: string[];
  multisig_validator_required: string;
  multisig_validator_signers: string[];
  multisig_refutxo_required: string;
  multisig_refutxo_signers: string[];
}

export function AttachConfigForm() {
  const { lucid, address } = useCardano();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<ConfigFormData>({
    fees_address:
      "addr_test1qzk08tz3s7xcaxq5q0udh5kpm6fz8vhpd230c07nehtzl5ahaqav4a8stg7sfudah7uxw5g9umv897ppygy559le55tql9690r",
    fees_amount: "100000000",
    fees_asset_policy_id: "",
    fees_asset_name: "",
    spend_address:
      "addr_test1qzk08tz3s7xcaxq5q0udh5kpm6fz8vhpd230c07nehtzl5ahaqav4a8stg7sfudah7uxw5g9umv897ppygy559le55tql9690r",
    categories: CATEGORIES,
    multisig_validator_required: "3",
    multisig_validator_signers: [
      "addr_test1qzk08tz3s7xcaxq5q0udh5kpm6fz8vhpd230c07nehtzl5ahaqav4a8stg7sfudah7uxw5g9umv897ppygy559le55tql9690r",
      "addr_test1qppjp6z53cr6axg59ezf93vlcqqva7wg6d5zfxr5fctnsuveaxzar94mukjwdp323ahhs3tsn0nmawextjtkfztcs20q6fmam2",
      "addr_test1qzzxrfxg6hq8zerw8g85cvcpxutjtgez5v75rs99kdnn404cfuf2xydw2zrehxmvd3k9nqywe3d6mn64a08ncc5h5s3qd5ewlk",
      "addr_test1qr3deh8jxn9ejxmuunv6krgtt6q600tt289pkdhg0vrfcvvrm9x488u4tefkkjay9k49yvdwc459uxc2064eulk2raaqjzwsv3",
      "addr_test1qzs3pj8vvkhu8d7g0p3sfj8896wds459gqcdes04c5fp7pcs2k7ckl5mly9f89s6zpnx9av7qnl59edp0jy2ac6twtmss44zee",
    ],
    multisig_refutxo_required: "3",
    multisig_refutxo_signers: [
      "addr_test1qzk08tz3s7xcaxq5q0udh5kpm6fz8vhpd230c07nehtzl5ahaqav4a8stg7sfudah7uxw5g9umv897ppygy559le55tql9690r",
      "addr_test1qppjp6z53cr6axg59ezf93vlcqqva7wg6d5zfxr5fctnsuveaxzar94mukjwdp323ahhs3tsn0nmawextjtkfztcs20q6fmam2",
      "addr_test1qzzxrfxg6hq8zerw8g85cvcpxutjtgez5v75rs99kdnn404cfuf2xydw2zrehxmvd3k9nqywe3d6mn64a08ncc5h5s3qd5ewlk",
      "addr_test1qr3deh8jxn9ejxmuunv6krgtt6q600tt289pkdhg0vrfcvvrm9x488u4tefkkjay9k49yvdwc459uxc2064eulk2raaqjzwsv3",
      "addr_test1qzs3pj8vvkhu8d7g0p3sfj8896wds459gqcdes04c5fp7pcs2k7ckl5mly9f89s6zpnx9av7qnl59edp0jy2ac6twtmss44zee",
    ],
  });

  const handleInputChange = (field: keyof ConfigFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!lucid || !address) {
      console.log("Missing lucid or address");
      return;
    }

    setIsSubmitting(true);

    try {
      const configParams = {
        fees_address: {
          pkh: paymentCredentialOf(formData.fees_address).hash,
          sc: stakeCredentialOf(formData.fees_address).hash,
        },
        fees_amount: BigInt(formData.fees_amount),
        fees_asset_class: {
          policy_id: formData.fees_asset_policy_id,
          asset_name: formData.fees_asset_name,
        },
        spend_address: {
          pkh: paymentCredentialOf(formData.spend_address).hash,
          sc: "",
        },
        categories: formData.categories.filter((cat) => cat.trim() !== ""),
        multisig_validator_group: {
          required: BigInt(formData.multisig_validator_required),
          signers: formData.multisig_validator_signers.filter(
            (signer) => signer.trim() !== ""
          ),
        },
        multisig_refutxoupdate: {
          required: BigInt(formData.multisig_refutxo_required),
          signers: formData.multisig_refutxo_signers.filter(
            (signer) => signer.trim() !== ""
          ),
        },
      };

      const result = await AttachConfigDatum(lucid, configParams);
      console.log("Transaction submitted:", result);
      alert(`Transaction submitted successfully! Hash: ${result}`);
    } catch (error) {
      console.error("Error submitting transaction:", error);
      alert(`Error: ${error}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Fees Configuration */}
      <Card className="border-teal-200">
        <CardHeader className="bg-teal-50">
          <CardTitle className="text-teal-800">Fees Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="">
            <div>
              <Label htmlFor="fees_address_pkh" className="text-teal-700">
                Fees Address
              </Label>
              <Input
                id="fees_address_pkh"
                value={formData.fees_address}
                onChange={(e) =>
                  handleInputChange("fees_address", e.target.value)
                }
                className="border-teal-200 focus:border-teal-500"
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="fees_amount" className="text-teal-700">
              Fees Amount (Lovelace)
            </Label>
            <Input
              id="fees_amount"
              type="number"
              value={formData.fees_amount}
              onChange={(e) => handleInputChange("fees_amount", e.target.value)}
              className="border-teal-200 focus:border-teal-500"
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fees_asset_policy_id" className="text-teal-700">
                Asset Policy ID
              </Label>
              <Input
                id="fees_asset_policy_id"
                value={formData.fees_asset_policy_id}
                onChange={(e) =>
                  handleInputChange("fees_asset_policy_id", e.target.value)
                }
                placeholder="default ADA policy ID"
                className="border-teal-200 focus:border-teal-500"
              />
            </div>
            <div>
              <Label htmlFor="fees_asset_name" className="text-teal-700">
                Asset Name
              </Label>
              <Input
                id="fees_asset_name"
                value={formData.fees_asset_name}
                onChange={(e) =>
                  handleInputChange("fees_asset_name", e.target.value)
                }
                placeholder="default ADA token"
                className="border-teal-200 focus:border-teal-500"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Spend Address Configuration */}
      <Card className="border-teal-200">
        <CardHeader className="bg-teal-50">
          <CardTitle className="text-teal-800">
            Spend Address Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="">
            <div>
              <Label htmlFor="spend_address_pkh" className="text-teal-700">
                Spend Address PKH
              </Label>
              <Input
                id="spend_address_pkh"
                value={formData.spend_address}
                onChange={(e) =>
                  handleInputChange("spend_address", e.target.value)
                }
                className="border-teal-200 focus:border-teal-500"
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <Card className="border-teal-200">
        <CardHeader className="bg-teal-50">
          <CardTitle className="text-teal-800">Categories</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <TagInput
            tags={formData.categories}
            onTagsChange={(newCategories) =>
              setFormData((prev) => ({ ...prev, categories: newCategories }))
            }
            placeholder="Enter a category and press Enter or click +"
          />
        </CardContent>
      </Card>

      {/* Multisig Validator Group */}
      <Card className="border-teal-200">
        <CardHeader className="bg-teal-50">
          <CardTitle className="text-teal-800">
            Multisig Validator Group
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div>
            <Label
              htmlFor="multisig_validator_required"
              className="text-teal-700"
            >
              Required Signatures
            </Label>
            <Input
              id="multisig_validator_required"
              type="number"
              value={formData.multisig_validator_required}
              onChange={(e) =>
                handleInputChange("multisig_validator_required", e.target.value)
              }
              className="border-teal-200 focus:border-teal-500"
              required
            />
          </div>
          <div>
            <Label className="text-teal-700">Signer Addresses</Label>
            <TagInput
              tags={formData.multisig_validator_signers}
              onTagsChange={(newSigners) =>
                setFormData((prev) => ({
                  ...prev,
                  multisig_validator_signers: newSigners,
                }))
              }
              placeholder="Enter signer address and press Enter or click +"
            />
          </div>
        </CardContent>
      </Card>

      {/* Multisig RefUTXO Update */}
      <Card className="border-teal-200">
        <CardHeader className="bg-teal-50">
          <CardTitle className="text-teal-800">DAO Member</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div>
            <Label
              htmlFor="multisig_refutxo_required"
              className="text-teal-700"
            >
              Required Signatures
            </Label>
            <Input
              id="multisig_refutxo_required"
              type="number"
              value={formData.multisig_refutxo_required}
              onChange={(e) =>
                handleInputChange("multisig_refutxo_required", e.target.value)
              }
              className="border-teal-200 focus:border-teal-500"
              required
            />
          </div>
          <div>
            <Label className="text-teal-700">Signer Addresses</Label>
            <TagInput
              tags={formData.multisig_refutxo_signers}
              onTagsChange={(newSigners) =>
                setFormData((prev) => ({
                  ...prev,
                  multisig_refutxo_signers: newSigners,
                }))
              }
              placeholder="Enter signer address and press Enter or click +"
            />
          </div>
        </CardContent>
      </Card>

      <Separator className="bg-teal-200" />

      <Button
        type="submit"
        disabled={!lucid || !address || isSubmitting}
        className="w-full bg-teal-700 hover:bg-teal-800 text-white py-3"
      >
        {isSubmitting
          ? "Submitting Transaction..."
          : "Attach Configuration Datum"}
      </Button>
    </form>
  );
}
