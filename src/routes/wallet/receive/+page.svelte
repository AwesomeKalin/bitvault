<script lang="ts">
	import { getNextAddress } from "$lib/addresses";
	import { heading1, heading3, secondaryButton } from "$lib/classes";
    import QrCode from "qrcode";

    async function getAddress(): Promise<string> {
        const address: string = await getNextAddress();
        let qrcode: string;
        QrCode.toDataURL(address, function (err: any, url: string) {
            if (err) {
                console.error(err);
                return;
            }

            document.getElementById("qrcode")?.setAttribute("src", url);
        });

        return address;
    }
</script>

<h1 class="{heading1}">Receive</h1>
<h3 class="{heading3}">Send ONLY BSV and 1SatOrdinals to this address. BSV20/21 and MNEE are currently NOT supported:</h3>
<br />
<img src="" alt="QR Code" id="qrcode" />

{#await getAddress()}
    <h1 class="{heading1}">Loading...</h1>
{:then address}
        <br />
        <h3 class="{heading3}">{address}</h3>
{/await}

<br />
<a href="/wallet" class="{secondaryButton}">Return</a>