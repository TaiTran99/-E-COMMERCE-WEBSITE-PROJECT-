import Products from "../../components/ui/Products"

const HomePage = () => {
  return (
    <div>
      <section>banner</section>
      <section className="products-list my-5">
        <Products title="Road" id='663c48ce037039fc3ad1e84d' />
      </section>
      <section className="products-list my-5">
        <Products title="Cruiser" id='663c48ce037039fc3ad1e850' />
      </section>
    </div>
  )
}

export default HomePage