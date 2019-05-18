/* @jsx mdx */
const makeShortcode = name => function MDXDefaultShortcode(props){
	console.warn("Component" + name + "was not imported, exported, or provided by MDXProvider as global scope")
	return <div{...props}/>
};

const layoutProps = {};

const MDXLayout = "wrapper"

function MDXContent( { components,...props } ) {
	return  <MDXLayout {...layoutProps} {...props} components = {components} mdxType = "MDXLayout">
		<h1>{`HelloWorld`}</h1>
    <p>{`body message`}</p>
		<h2>{`h2 title`}</h2>
		<p>{`highlight`}</p>
	</MDXLayout>
	;
}

MDXContent.isMDXComponent = true;
