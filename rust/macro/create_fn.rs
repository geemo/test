macro_rules! create_fn {
  ($fn_name: ident) => {
    fn $fn_name() {
      println!("You called {:?}()", stringify!($fn_name))
    }
  };
}

create_fn!(foo);
create_fn!(bar);

fn main() {
  foo();
  bar();
}
