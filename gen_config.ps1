$currentDir = Get-Location
$logoPath = Join-Path $currentDir "logo.png"

if (-Not (Test-Path $logoPath)) {
    Write-Error "logo.png not found in current directory!"
    return
}

$imageBuf = [System.IO.File]::ReadAllBytes($logoPath)
$base64Image = [System.Convert]::ToBase64String($imageBuf)
$payloadUUID = [System.Guid]::NewGuid().ToString().ToUpper()
$profileUUID = [System.Guid]::NewGuid().ToString().ToUpper()
$label = "NeoBank"
$url = "https://neobank-encrypted.vercel.app"

$xml = "<?xml version=`"1.0`" encoding=`"UTF-8`"?>
<!DOCTYPE plist PUBLIC `"-//Apple//DTD PLIST 1.0//EN`" `"http://www.apple.com/DTDs/PropertyList-1.0.dtd`">
<plist version=`"1.0`">
<dict>
	<key>PayloadContent</key>
	<array>
		<dict>
			<key>FullScreen</key>
			<true/>
			<key>Icon</key>
			<data>$base64Image</data>
			<key>IsRemovable</key>
			<true/>
			<key>Label</key>
			<string>$label</string>
			<key>PayloadDescription</key>
			<string>Configures NeoBank Web App Clip</string>
			<key>PayloadDisplayName</key>
			<string>NeoBank Web Clip</string>
			<key>PayloadIdentifier</key>
			<string>com.neobank.encrypted.webclip.$payloadUUID</string>
			<key>PayloadType</key>
			<string>com.apple.webClip.managed</string>
			<key>PayloadUUID</key>
			<string>$payloadUUID</string>
			<key>PayloadVersion</key>
			<integer>1</integer>
			<key>Precomposed</key>
			<true/>
			<key>URL</key>
			<string>$url</string>
		</dict>
	</array>
	<key>PayloadDisplayName</key>
	<string>$label Profile</string>
	<key>PayloadIdentifier</key>
	<string>com.neobank.encrypted.profile.$profileUUID</string>
	<key>PayloadRemovalDisallowed</key>
	<false/>
	<key>PayloadType</key>
	<string>Configuration</string>
	<key>PayloadUUID</key>
	<string>$profileUUID</string>
	<key>PayloadVersion</key>
	<integer>1</integer>
</dict>
</plist>"

$outputPath = Join-Path $currentDir "ios_profile.mobileconfig"
[System.IO.File]::WriteAllText($outputPath, $xml, [System.Text.Encoding]::UTF8)
Write-Host "Done! ios_profile.mobileconfig generated with logo.png in current directory."
