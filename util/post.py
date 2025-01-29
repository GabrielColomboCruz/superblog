# Cria post aleatorios
import random


user_ids = list(range(2, 11))
categories = {
    2: 'Technology',
    3: 'Science',
    4: 'Sports',
    5: 'Art',
    6: 'Music',
    7: 'Travel',
    8: 'Health',
    9: 'Education',
    10: 'Food',
    11: 'Movies',
    12: 'Books',
    13: 'Gaming'
}

def generate_random_post_query():
    # Randomly select a category
    category_id = random.choice(list(categories.keys()))
    category_name = categories[category_id]
    
    # Generate title and content based on the category
    titulo = f"Post about {category_name}"
    conteudo = f"Content is about {category_name}. This is a random generated post. Lorem ipsum dolor sit amet, consectetur adipiscing elit."

    # Randomly select a user ID
    usuario_id = random.choice(user_ids)

    # Construct the SQL query
    query = f"INSERT INTO posts (titulo, conteudo, usuario_id, categoria_id) VALUES ('{titulo}', '{conteudo}', {usuario_id}, {category_id});"
    return query

# Example usage: Generate a random SQL query for posts
for i in range(1,50):
    random_query = generate_random_post_query()
    print(random_query)