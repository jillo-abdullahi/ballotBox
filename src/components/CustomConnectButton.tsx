import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function CustomConnectButton() {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    type="button"
                    className="cursor-pointer rounded-xl bg-blue-text/10 border border-blue-text/20 px-3 py-2 sm:px-5 sm:py-3 text-sm text-blue-text hover:bg-blue-text/20 focus:bg-blue-text/5 focus:ring-2 focus:ring-blue-text/20 focus:outline-none transition-all duration-200 font-medium"
                  >
                    <span className="hidden sm:inline">Connect Wallet</span>
                    <span className="sm:hidden">Connect</span>
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    type="button"
                    className="cursor-pointer rounded-xl bg-red-text/10 border border-red-text/20 px-3 py-2 sm:px-5 sm:py-3 text-sm text-red-text hover:bg-red-text/20 focus:bg-red-text/5 focus:ring-2 focus:ring-red-text/20 focus:outline-none transition-all duration-200 font-medium"
                  >
                    <span className="hidden sm:inline">Wrong network</span>
                    <span className="sm:hidden">Wrong net</span>
                  </button>
                );
              }

              return (
                <div className="flex items-center gap-1 sm:gap-2">
                  <button
                    onClick={openChainModal}
                    type="button"
                    className="cursor-pointer rounded-xl bg-blue-text/10 border border-blue-text/20 px-2 py-2 sm:px-3 sm:py-3 text-sm text-blue-text hover:bg-blue-text/20 focus:bg-blue-text/5 focus:ring-2 focus:ring-blue-text/20 focus:outline-none transition-all duration-200 font-medium"
                    title={chain.name}
                  >
                    {chain.hasIcon && (
                      <div
                        style={{
                          background: chain.iconBackground,
                          width: 16,
                          height: 16,
                          borderRadius: 999,
                          overflow: "hidden",
                        }}
                      >
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? "Chain icon"}
                            src={chain.iconUrl}
                            style={{ width: 16, height: 16 }}
                          />
                        )}
                      </div>
                    )}
                  </button>

                  <button
                    onClick={openAccountModal}
                    type="button"
                    className="cursor-pointer rounded-xl bg-blue-text/10 border border-blue-text/20 px-3 py-2 sm:px-5 sm:py-3 text-sm text-blue-text hover:bg-blue-text/20 focus:bg-blue-text/5 focus:ring-2 focus:ring-blue-text/20 focus:outline-none transition-all duration-200 font-medium truncate max-w-[120px] sm:max-w-none"
                    title="Connected wallet"
                  >
                    <span className="hidden sm:inline">
                      {account.displayName}
                      {account.displayBalance
                        ? ` (${account.displayBalance})`
                        : ""}
                    </span>
                    <span className="sm:hidden">
                      {account.displayName}
                    </span>
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
