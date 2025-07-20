import React from 'react';
import Button from '~components/Button';

const throwError = () => {
  throw new Error('there was 1 Error message here, but Amon stole it (╭ರ_•́)');
};

export class ErrorButton extends React.PureComponent {
  state = {
    shouldThrow: false,
  };
  handleClick = () => {
    this.setState({ shouldThrow: true });
  };
  componentDidUpdate(): void {
    if (this.state.shouldThrow) {
      throwError();
    }
  }
  render() {
    return (
      <Button
        onClick={this.handleClick}
        className="fixed end-2.5 bottom-2.5"
        {...this.props}
      >
        Strange Button
      </Button>
    );
  }
}
