import React from 'react';
import { MoreHorizontal, MessageSquare, Paperclip } from 'lucide-react';
import styles from './KanbanBoard.module.css';

interface CardData {
  id: string;
  title: string;
  subtitle: string;
  tags: string[];
  comments: number;
  attachments: number;
  avatarUrl?: string;
}

interface ColumnData {
  id: string;
  title: string;
  cards: CardData[];
}

interface KanbanBoardProps {
  columns: ColumnData[];
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ columns }) => {
  return (
    <div className={styles.boardContainer}>
      <div className={styles.board}>
        {columns.map(col => (
          <div key={col.id} className={styles.column}>
            <div className={styles.columnHeader}>
              <h3 className={styles.columnTitle}>
                {col.title} <span className={styles.cardCount}>{col.cards.length}</span>
              </h3>
              <button className={styles.columnAction}><MoreHorizontal size={16} /></button>
            </div>
            
            <div className={styles.cardList}>
              {col.cards.map(card => (
                <div key={card.id} className={styles.card}>
                  <div className={styles.cardTags}>
                    {card.tags.map(tag => (
                      <span key={tag} className={styles.tag}>{tag}</span>
                    ))}
                  </div>
                  <h4 className={styles.cardTitle}>{card.title}</h4>
                  <p className={styles.cardSubtitle}>{card.subtitle}</p>
                  
                  <div className={styles.cardFooter}>
                    <div className={styles.cardMetrics}>
                      {card.comments > 0 && (
                        <span className={styles.metric}>
                          <MessageSquare size={14} /> {card.comments}
                        </span>
                      )}
                      {card.attachments > 0 && (
                        <span className={styles.metric}>
                          <Paperclip size={14} /> {card.attachments}
                        </span>
                      )}
                    </div>
                    {card.avatarUrl && (
                      <img src={card.avatarUrl} alt="Assignee" className={styles.assigneeAvatar} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;
