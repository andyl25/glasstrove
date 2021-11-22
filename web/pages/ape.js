import { gql, useQuery } from "@apollo/client";

const EXAMPLE = gql`
  query ExampleQuery {
    countries {
      code
      name
    }
  }
`;

const Ape = () => {
  const {data, loading, error} = useQuery(EXAMPLE);

  return <div>{console.log(data)}</div>;
};

export default Ape;
