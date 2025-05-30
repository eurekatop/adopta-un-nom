import {
  card,
  cardImage,
  cardContent,
  cardFooter,
  cardText,
  cardTitle,
} from './card.css.ts';

interface Props {
  title: string;
  description: string;
  image: string;
  onClick?: () => void;
}

export default function Card({ title, description, image, onClick }: Props) {

  return (
    <div class={card}>
      <img class={cardImage} src={image} alt={title} />
      <div class={cardContent}>
        <div class={cardTitle}>{title}</div>
        <div class={cardText}>{description}</div>
        <small>6 weeks old</small>
      </div>
      <div class={cardFooter}>
        <sl-button variant="primary" size="large">Jugar</sl-button>
      </div>
    </div>
  );
}
