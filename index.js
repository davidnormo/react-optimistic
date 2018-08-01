const React = require('react')
const PropTypes = require('prop-types')

class Optimistic extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      state: props.initialState,
      reqState: Optimistic.NONE_REQUEST_STATE,
    }
  }

  componentWillUnmount() {
    if (this.promise) this.promise.cancelled = true
  }

  getToggledState() {
    return this.state.state === Optimistic.NOT_UPDATED_STATE
      ? Optimistic.UPDATED_STATE
      : Optimistic.NOT_UPDATED_STATE
  }

  render() {
    return this.props.children({
      state: this.state.state,
      reqState: this.state.reqState,
      reset: () => {
        if (this.promise) this.promise.cancelled = true
        this.setState({
          reqState: Optimistic.NONE_REQUEST_STATE,
          state: this.getToggledState(),
        })
      },
      updater: (action) =>
        (...args) => {
          this.setState({
            reqState: Optimistic.PENDING_REQUEST_STATE,
            state: this.getToggledState(),
          })
          this.promise = action(...args)

          return this.promise.then(
            () => {
              this.setState({
                reqState: Optimistic.RESOLVED_REQUEST_STATE,
              })
            },
            () => {
              if (this.promise.cancelled) return

              this.setState({
                reqState: Optimistic.REJECTED_REQUEST_STATE,
              })
            }
          )
        }
    })
  }
}

Optimistic.NOT_UPDATED_STATE = 'not updated'
Optimistic.UPDATED_STATE = 'updated'
Optimistic.FAILED_STATE = 'failed'

Optimistic.NONE_REQUEST_STATE = 'none'
Optimistic.PENDING_REQUEST_STATE = 'pending'
Optimistic.RESOLVED_REQUEST_STATE = 'resolved'
Optimistic.REJECTED_REQUEST_STATE = 'rejected'

Optimistic.defaultProps = {
  initialState: Optimistic.NOT_UPDATED_STATE,
}

Optimistic.propTypes = {
  children: PropTypes.func.isRequired,
  initialState: PropTypes.oneOf([
    Optimistic.NOT_UPDATED_STATE,
    Optimistic.UPDATED_STATE,
  ])
}

module.exports = Optimistic