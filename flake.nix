{
  description = "Flake utils demo";
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let pkgs = nixpkgs.legacyPackages.${system}; in
      {
        devShells = rec {
            default = pkgs.mkShell {
                buildInputs = [
                    pkgs.poetry
                    pkgs.nodejs_20
                ];
            };
        };
      }
    );
}
