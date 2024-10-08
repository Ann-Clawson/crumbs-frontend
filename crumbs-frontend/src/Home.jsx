import caramelChocChip from "./assets/CaramelChocChip_sash-1-1.jpg";
import LogIn from "./Login";

export function Home() {
  return (
    <div className="home-page">
      <img src={caramelChocChip} width="300" alt="Caramel Chocolate Chip Cookie" />
      <h1 className="home-crumbs">
        Crumbs<span className="copyright"> &copy;</span>
      </h1>
      <h4 className="accounting">Accounting for every piece</h4>
      <LogIn />
    </div>
  );
}
