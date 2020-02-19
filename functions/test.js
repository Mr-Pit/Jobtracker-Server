let recipe = {
  name: "Pomergranate-Glazed Duck Breast",
  description:
    "This recipe for delicious pomergranate-glazed duck breast makes a perfect holiday meal. Source: The Martha Stewart Show, December Winter 2006",
  ingredients: [
    {
      amount: 1,
      measurement: "teaspoon",
      ingredient: "ground fennel"
    },
    {
      amount: 3,
      measurement: "tablespoons",
      ingredient: "coarse salt"
    },
    {
      amount: 1 / 2,
      measurement: "teaspoon",
      ingredient: "ground coriander"
    },
    {
      amount: 1 / 2,
      measurement: "teaspoon",
      ingredient: "gound lavender"
    },
    {
      amount: 3,
      measurement: " one pound ",
      ingredient: "duck breast halves, trimmed of excess fat and scored"
    },
    {
      amount: 2,
      measurement: "zest",
      ingredient: "oranges"
    },
    {
      amount: 1 / 4,
      measurement: "cup",
      ingredient: "brandy"
    },
    {
      amount: 6,
      measurement: "sprigs",
      ingredient: "fresh thyme"
    },
    {
      amount: 1,
      measurement: "teaspoon",
      ingredient: "freshly ground black pepper"
    },
    {
      amount: 1,
      measurement: "cup",
      ingredient: "Pomergranate Glaze"
    }
  ],
  directions: [
    "In a small bowl, mix together fennel, salt, lavender, and coriander. Place duck breasts, skin up, in a large dish. Sprinkle evenly with the spice mixture. Flip breasts over and place the zest, brandy, and thyme evenly on the flesh; let marinate for 30 minutes.",
    "Preheat oven to 350 degrees. Place the duck breasts, skin side down, in a large ovenproof skillet over medium heat. Cook until the fat is rendered and the skin is crisp and thin, about 15 minutes.",
    "Transfer breasts to oven and cook until pink in the center, about 4 minutes. Let duck rest for 2 minutes before slicing. Divide duck evenly among 4 serving plates and spoon over pomegranate glaze."
  ]
}

console.log(recipe.name) //should output "Pomegranate-Glazed Duck Breast"
console.log(recipe.description.slice()) //should output "This recipe for d... Winter 2006"
console.log(recipe.ingredients[3].measurement) //should output "teaspoon"
console.log(recipe.ingredients[recipe.ingredients.length - 1].ingredient) //should output "Pomegranate Glaze"
console.log(recipe.ingredients[2].amount) //should output 0.5
console.log(
  recipe.description.slice(64, 80) + recipe.directions[0].slice(20, 30)
) //this is a surprise output! 😃
