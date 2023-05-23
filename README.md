# OpenAPI WebUI

## Environment Provisioning

Requirements
- use one of WSL2, Linux, or MacOS

### Steps

- Install Nix https://nixos.org/download.html#download-nix
  - Make sure you have 'experimental-features = nix-command flakes' in `~/.config/nix/nix.conf`, cf. https://nixos.wiki/wiki/Flakes#Permanent
- Open a disposable shell by `nix develop .`

