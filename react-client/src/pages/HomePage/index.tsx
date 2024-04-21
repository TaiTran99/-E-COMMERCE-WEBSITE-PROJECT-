import Products from "../../components/ui/Products"

const HomePage = () => {
  return (
    <div>
      <section>banner</section>
      <section className="products-list my-5">
        <Products title="Road" id='65faaaf2769cb640a51856c2' />
      </section>
      <section className="products-list my-5">
        <Products title="Cruiser" id='65faaaf2769cb640a51856c5' />
      </section>
    </div>
  )
}

export default HomePage