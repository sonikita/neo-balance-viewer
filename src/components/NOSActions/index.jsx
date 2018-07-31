import React from "react";
import injectSheet from "react-jss";
import PropTypes from "prop-types";
import { injectNOS, nosProps } from "@nosplatform/api-functions/lib/react";

const styles = {
  button: {
    margin: "16px",
    fontSize: "14px"
  }
};

class NOSActions extends React.Component {
  constructor() {
    super();

    this.state = {
      balances: {},
      address: "N/A"
    };
  }

  ASSETS = [
    ["NEO", "c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b"],
    ["GAS", "602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7"],
    ["RPX (Red Pulse)", "ecc6b20d3ccac1ee9ef109af5a7cdb85706b1df9"],
    ["ONT (Ontology)", "ceab719b8baa2310f232ee0d277c061704541cfb"],
    ["DBC (DeepBrain)", "b951ecbbc5fe37a9c280a76cb0ce0014827294cf"],
    ["QLC (Qlink)", "0d821bd7b6d53f5c2b40e217c6defc8bbe896cf5"]
  ];

  handleAlert = async func => alert(await func);

  loadAddress = async () => {
    const address = await this.props.nos.getAddress();
    if (address.length === 0) {
      return;
    }
    const stateClone = Object.assign({}, this.state);
    stateClone.address = address;
    this.setState(stateClone);
  };

  handleClaimGas = () =>
    this.props.nos
      .claimGas()
      .then(alert)
      .catch(alert);

  loadBalances = async () => {
    for (let i = 0; i < this.ASSETS.length; i++) {
      await this.loadBalance(this.ASSETS[i]);
    }
  };

  loadBalance = async (assetNameAndContract) => {
    const { nos } = this.props;

    const asset = assetNameAndContract[0];
    const contract = assetNameAndContract[1];

    this.setState(this.getUpdatedState(asset, -1));
    const balance = await nos.getBalance({ asset: contract });
    this.setState(this.getUpdatedState(asset, balance));
  };

  getUpdatedState = (asset, balance) => {
    const clonedState = Object.assign({}, this.state);
    const clonedBalances = Object.assign({}, clonedState.balances);
    clonedBalances[asset] = balance;
    clonedState.balances = clonedBalances;
    return clonedState;
  };

  render() {
    const { classes } = this.props;

    const { balances } = this.state;

    return (
      <React.Fragment>
        <div>
          Your address: {this.state.address}
        </div>
        <button className={classes.button} onClick={() => this.loadAddress()}>
          Load address
        </button>
        <button className={classes.button} onClick={() => this.loadBalances()}>
          Update balance
        </button>
        {this.ASSETS.map(assetPair => {
          const assetName = assetPair[0];
          const balance = balances[assetName];

          let balanceWord = "N/A";
          if (balance === -1) {
            balanceWord = "LOADING...";
          } else if (balance != null) {
            balanceWord = balance.toString();
          }

          return <div key={assetName}>{`${assetName}: ${balanceWord}`}</div>;
        })}
      </React.Fragment>
    );
  }
}

NOSActions.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  nos: nosProps.isRequired
};

export default injectNOS(injectSheet(styles)(NOSActions));
