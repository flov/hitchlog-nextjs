import { Button } from 'flowbite-react';
import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import PostCard from '../../../src/components/Blog/PostCard';
import { useAuth } from '../../../src/components/contexts/AuthContext';
import { useToasts } from '../../../src/components/contexts/ToastContext';
import { getPosts } from '../../../src/db/posts';
import { Post } from '../../../src/types/Post';

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const posts = await getPosts();
    return {
      props: { posts: JSON.parse(JSON.stringify(posts.data)) },
    };
  } catch {
    return {
      notFound: true,
    };
  }
};

const Index: NextPage<{ posts: Post[] }> = ({ posts }) => {
  const { currentUser } = useAuth();
  const router = useRouter();
  const { addToast } = useToasts();

  useEffect(() => {
    if (currentUser !== null && (!currentUser || currentUser.id !== 1)) {
      addToast('You are not authorized to view this page', 'error');
      router.push('/login');
    }
  }, []);

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="px-4 py-8 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="grid gap-8 lg:grid-cols-2">
          {posts.map((post) => (
            <div key={post.id}>
              <Link href={`/blog/admin/${post.to_param}`}>
                <Button className="mb-2">Edit</Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Index;
