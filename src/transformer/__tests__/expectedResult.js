class MDXContent extends React.Component {
  constructor(props) {
    super(props)
    this.layout = null
  }
  render() {
    const { components, ...props } = this.props
    return 
      <MDXTag name="wrapper" components={components}>
        <MDXTag name="h1" components={components}>
          {`Hello World`}
        </MDXTag>
        <MDXTag name="p" components={components}>{`body message`}</MDXTag>
        <MDXTag name="h2" components={components}>{`h2 title`}</MDXTag>
        <MDXTag name="p" components={components}>{`highlight`}</MDXTag>
      </MDXTag>
  }
}