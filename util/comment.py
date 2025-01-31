# Cria comentarios aleatorios
import random


user_ids = list(range(2, 11))
post_ids = list(range(16,75))
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
categories2 = {
    2: 'Boom',
    3: 'League of Legends is a Game',
    4: 'Bauss is a Sion player',
    5: 'Why don\'t we play warframe',
    6: 'Have you heard Deco*27 new song',
    7: 'Surveilance is a real thing that happens',
    8: 'No ideia what else to do here',
    9: 'Fate nobble phantams are really cool',
    10: 'One should no code in portuEnglish',
    11: 'After all that is a really bad idea',
    12: 'Who though that giving custom contento the comments was a good idea',
    13: 'Well this part is done'
}
categories3 = {
    2: 'Play league',
    3: 'Experience Black souls',
    4: 'Give you UP',
    5: 'Get magic at high cost',
    6: 'Play a visual novel',
    7: 'Do this again',
    8: 'Create Custom Comments',
    9: 'Learn how to write properly',
    10: 'Eat more healty food',
    11: 'Let you down',
    12: 'Read a book',
    13: 'Become a wizard'
}

def generate_random_post_query():
    # Randomly select a coment part
    category_id = random.choice(list(categories.keys()))
    category_name = categories[category_id]
    category_id2 = random.choice(list(categories2.keys()))
    category_name2 = categories[category_id2]
    category_id3 = random.choice(list(categories3.keys()))
    category_name3 = categories[category_id3]
    
    # Generate title and content based on the category    
    conteudo = f"Content is about {category_name}. This has happened {category_name2}. Would you {category_name3}This is a random generated coment. Lorem ipsum dolor sit amet, consectetur adipiscing elit."

    # Randomly select a user ID
    usuario_id = random.choice(user_ids)
    post_id = random.choice(post_ids)

    # Construct the SQL query
    query = f"INSERT INTO comentarios (conteudo, usuario_id, post_id) VALUES ('{conteudo}', {usuario_id}, {post_id});"
    return query

# Example usage: Generate a random SQL query for posts
for i in range(1,300):
    random_query = generate_random_post_query()
    print(random_query)