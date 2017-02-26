# Development on Debian/Ubuntu

Also including: **Linux Mint**, **Linux Mint Debian Edition (LMDE)**,
**elementaryOS** and others.

## Installation process

Execute the following on a terminal:

```bash
# node
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
# yarn
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt-get update && sudo apt-get -y install yarn nodejs
```

## References

* <https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions>
* <https://yarnpkg.com/en/docs/install#linux-tab>
