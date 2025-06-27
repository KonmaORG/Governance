import { AttachConfigButton } from "@/components/buttons/configDatum";
import { MintIdentificationButton } from "@/components/buttons/identification";

export default function Admin() {
  return (
    <div>
      <h1>Admin Page</h1>
      <div className="mx-auto">
        <div className="">
          <h1>
            ONLY FOR ONE TIME USAGE - Calling again will break the rest of the
            code
          </h1>
          <MintIdentificationButton
            name="Mint Identification Token"
            color="teal"
          />
        </div>
        <div className="">
          <h1>ONLY FOR ONE TIME USAGE</h1>
          <AttachConfigButton name="Attach Configuration Datum" color="teal" />
        </div>
      </div>
    </div>
  );
}
