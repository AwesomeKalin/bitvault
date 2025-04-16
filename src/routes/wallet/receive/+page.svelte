<script lang="ts">
	import { getNextAddress } from "$lib/addresses";
	import { heading1, heading3, secondaryButton } from "$lib/classes";
    import QrCode from "qrcode";

    //@ts-expect-error Should work
    async function getAddress(): Promise<{ address: string; url: string }> {
        const address: string = await getNextAddress();
        let qrcode: string;
        QrCode.toDataURL(address, function (err: any, url: string) {
            if (err) {
                console.error(err);
                return;
            }

            return { address, url };
        });
    }
</script>

<!--{#await getNextAddress()}
	<p>Next address: Loading...</p>
{:then address}
	<p>Next address: {address}</p>
{/await}-->

{#await getAddress()}
    <h1 class="{heading1}">Loading...</h1>
{:then { address, url }}
        <h1 class="{heading1}">Receive</h1>
        <h3 class="{heading1}">Send ONLY BSV to this address. 1SatOrdinals and MNEE are currently NOT supported:</h3>
        <br />
        <img src={url} alt="QR Code" />
        <h3 class="{heading3}">{address}</h3>
{/await}

<a href="/wallet" class="{secondaryButton}">Return</a>